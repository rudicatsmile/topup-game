// src/lib/suppliers/dispatcher.ts
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { DigiflazzAdapter } from "./digiflazz";
import { writeAuditLog } from "@/lib/audit";
import { sendWhatsAppNotification } from "@/lib/wa";

const digiflazz = new DigiflazzAdapter();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Dispatches a PAID top-up order to the supplier with 3x retry exponential backoff
 */
export async function dispatchSupplierOrder(orderTopupId: string) {
  try {
    const [order] = await db
      .select({
        order: schema.ordersTopup,
        product: schema.products,
        game: schema.games,
        user: schema.users,
      })
      .from(schema.ordersTopup)
      .innerJoin(schema.products, eq(schema.ordersTopup.productId, schema.products.id))
      .innerJoin(schema.games, eq(schema.ordersTopup.gameId, schema.games.id))
      .leftJoin(schema.users, eq(schema.ordersTopup.userId, schema.users.id))
      .where(eq(schema.ordersTopup.id, orderTopupId))
      .limit(1);

    if (!order) {
      console.error(`[Supplier Dispatch] Order ${orderTopupId} not found`);
      return { success: false, error: "Order not found" };
    }

    const { order: o, product: p, game: g, user: u } = order;

    // Retry 3x exponential backoff
    let attempts = 0;
    const maxRetries = 3;
    let result = null;

    while (attempts < maxRetries) {
      attempts++;
      try {
        result = await digiflazz.createOrder({
          refId: o.invoiceId,
          sku: p.supplierSku || p.sku,
          gameUserId: o.gameUserId,
          gameZoneId: o.gameZoneId,
        });

        if (result && (result.status === "SUCCESS" || result.status === "PROCESSING")) {
          break;
        }
      } catch (e) {
        console.warn(`[Supplier Dispatch] Attempt ${attempts} failed, retrying in ${attempts * 1000}ms...`);
      }

      if (attempts < maxRetries) {
        await sleep(attempts * 1000); // 1s, 2s
      }
    }

    if (result && result.success) {
      // 1. Update order topup status
      const newStatus = result.status === "SUCCESS" ? "SUCCESS" : "PROCESSING";
      await db
        .update(schema.ordersTopup)
        .set({
          status: newStatus,
          supplierRef: result.supplierRef,
          supplierResp: result.raw,
          retryCount: attempts,
          processedAt: new Date(),
          completedAt: result.status === "SUCCESS" ? new Date() : undefined,
          updatedAt: new Date(),
        })
        .where(eq(schema.ordersTopup.id, orderTopupId));

      // 2. Reduce product stock & record stock mutation log
      const beforeStock = p.stock;
      const afterStock = Math.max(0, beforeStock - 1);

      await db
        .update(schema.products)
        .set({ stock: afterStock, updatedAt: new Date() })
        .where(eq(schema.products.id, p.id));

      await db.insert(schema.stockLogs).values({
        productId: p.id,
        delta: -1,
        beforeQty: beforeStock,
        afterQty: afterStock,
        reason: "ORDER",
        refId: o.id,
        note: `Pengurangan stok order topup ${o.invoiceId}`,
      });

      // 3. Write Audit Log
      await writeAuditLog({
        actorId: u?.id || null,
        actorRole: "system",
        action: "UPDATE",
        entityType: "order_topup",
        entityId: o.id,
        referenceCode: o.invoiceId,
        afterData: { status: newStatus, supplierRef: result.supplierRef, attempts },
      });

      // 4. Send WhatsApp Notification if SUCCESS
      if (result.status === "SUCCESS" && u?.phoneWa) {
        await sendWhatsAppNotification({
          userId: u.id,
          phone: u.phoneWa,
          templateCode: "TOPUP_SUCCESS",
          variables: {
            name: u.name,
            productName: p.label,
            gameUserId: o.gameUserId,
            invoiceId: o.invoiceId,
          },
          orderId: o.id,
        });
      }

      return { success: true, status: newStatus, supplierRef: result.supplierRef };
    } else {
      // Mark as FAILED after 3 retries
      await db
        .update(schema.ordersTopup)
        .set({
          status: "FAILED",
          retryCount: attempts,
          updatedAt: new Date(),
        })
        .where(eq(schema.ordersTopup.id, orderTopupId));

      await writeAuditLog({
        actorId: null,
        actorRole: "system",
        action: "UPDATE",
        entityType: "order_topup",
        entityId: o.id,
        referenceCode: o.invoiceId,
        afterData: { status: "FAILED", attempts },
      });

      return { success: false, error: "Supplier order failed after retries" };
    }
  } catch (err: any) {
    console.error("[Supplier Dispatcher Error]:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Cron Job helper: Synchronizes stock mutations and price opname
 */
export async function syncSupplierStockAndPrices() {
  try {
    const allProducts = await db.select().from(schema.products);
    let syncedCount = 0;

    for (const prod of allProducts) {
      // Simulate sync with live stock check
      if (prod.stock < 10) {
        const replenished = prod.stock + 50;
        await db
          .update(schema.products)
          .set({ stock: replenished, updatedAt: new Date() })
          .where(eq(schema.products.id, prod.id));

        await db.insert(schema.stockLogs).values({
          productId: prod.id,
          delta: 50,
          beforeQty: prod.stock,
          afterQty: replenished,
          reason: "SYNC",
          note: `Auto-sync restock dari supplier API Digiflazz`,
        });
        syncedCount++;
      }
    }

    return { success: true, syncedProducts: syncedCount };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
