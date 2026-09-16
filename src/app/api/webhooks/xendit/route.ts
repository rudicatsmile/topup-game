// src/app/api/webhooks/xendit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyXenditWebhookToken } from "@/lib/xendit";
import { writeAuditLog } from "@/lib/audit";
import { dispatchSupplierOrder } from "@/lib/suppliers/dispatcher";
import { sendWhatsAppNotification } from "@/lib/wa";

export async function POST(req: NextRequest) {
  try {
    const callbackToken = req.headers.get("x-callback-token");
    if (!verifyXenditWebhookToken(callbackToken)) {
      return NextResponse.json({ success: false, error: "Unauthorized token" }, { status: 401 });
    }

    const payload = await req.json();
    const externalId = payload.external_id || payload.id;
    const status = payload.status; // 'PAID', 'EXPIRED', 'SETTLED'
    const eventType = payload.event_type || `INVOICE_${status}`;

    if (!externalId) {
      return NextResponse.json({ success: false, error: "Missing external_id" }, { status: 400 });
    }

    // 1. Idempotency check with payment_events
    try {
      const existingEvent = await db
        .select()
        .from(schema.paymentEvents)
        .where(
          and(
            eq(schema.paymentEvents.externalId, externalId),
            eq(schema.paymentEvents.eventType, eventType)
          )
        )
        .limit(1);

      if (existingEvent.length > 0) {
        return NextResponse.json({
          success: true,
          message: "Event already processed (idempotent)",
        });
      }

      await db.insert(schema.paymentEvents).values({
        externalId,
        eventType,
        payload,
      });
    } catch {}

    const isPaid = status === "PAID" || status === "SETTLED";

    // 2. Process Top-Up Order
    const topupOrder = await db
      .select({
        order: schema.ordersTopup,
        user: schema.users,
        game: schema.games,
      })
      .from(schema.ordersTopup)
      .leftJoin(schema.users, eq(schema.ordersTopup.userId, schema.users.id))
      .leftJoin(schema.games, eq(schema.ordersTopup.gameId, schema.games.id))
      .where(eq(schema.ordersTopup.invoiceId, externalId))
      .limit(1);

    if (topupOrder.length > 0) {
      const { order, user, game } = topupOrder[0];

      if (isPaid) {
        // Update payment & order
        await db
          .update(schema.payments)
          .set({
            status: "PAID",
            paidAt: new Date(),
            rawPayload: payload,
            xenditPaymentId: payload.id,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.payments.referenceType, "topup"),
              eq(schema.payments.referenceId, order.id)
            )
          );

        await db
          .update(schema.ordersTopup)
          .set({
            status: "PROCESSING",
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.ordersTopup.id, order.id));

        // Audit Log
        await writeAuditLog({
          actorId: null,
          actorRole: "webhook_xendit",
          action: "UPDATE",
          entityType: "payment",
          entityId: order.id,
          referenceCode: externalId,
          afterData: { status: "PAID", amount: payload.paid_amount || payload.amount },
        });

        // WhatsApp Notification: ORDER_PAID
        if (user?.phoneWa) {
          await sendWhatsAppNotification({
            userId: user.id,
            phone: user.phoneWa,
            templateCode: "ORDER_PAID",
            variables: {
              name: user.name,
              invoiceId: order.invoiceId,
              total: Number(order.total).toLocaleString("id-ID"),
            },
            orderId: order.id,
          });
        }

        // Automatic Supplier Dispatch
        await dispatchSupplierOrder(order.id);
      } else if (status === "EXPIRED") {
        await db
          .update(schema.ordersTopup)
          .set({ status: "EXPIRED", updatedAt: new Date() })
          .where(eq(schema.ordersTopup.id, order.id));
      }

      return NextResponse.json({ success: true, processed: "topup" });
    }

    // 3. Process Joki Order
    const jokiOrder = await db
      .select({
        order: schema.ordersJoki,
        user: schema.users,
      })
      .from(schema.ordersJoki)
      .leftJoin(schema.users, eq(schema.ordersJoki.userId, schema.users.id))
      .where(eq(schema.ordersJoki.invoiceId, externalId))
      .limit(1);

    if (jokiOrder.length > 0) {
      const { order, user } = jokiOrder[0];

      if (isPaid) {
        await db
          .update(schema.payments)
          .set({
            status: "PAID",
            paidAt: new Date(),
            rawPayload: payload,
            xenditPaymentId: payload.id,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.payments.referenceType, "joki"),
              eq(schema.payments.referenceId, order.id)
            )
          );

        await db
          .update(schema.ordersJoki)
          .set({
            status: "QUEUED",
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.ordersJoki.id, order.id));

        await writeAuditLog({
          actorId: null,
          actorRole: "webhook_xendit",
          action: "UPDATE",
          entityType: "payment",
          entityId: order.id,
          referenceCode: externalId,
          afterData: { status: "PAID" },
        });

        if (user?.phoneWa) {
          await sendWhatsAppNotification({
            userId: user.id,
            phone: user.phoneWa,
            templateCode: "ORDER_PAID",
            variables: {
              name: user.name,
              invoiceId: order.invoiceId,
              total: Number(order.total).toLocaleString("id-ID"),
            },
            orderId: order.id,
          });
        }
      }

      return NextResponse.json({ success: true, processed: "joki" });
    }

    return NextResponse.json({ success: true, message: "Order matched and logged" });
  } catch (err: any) {
    console.error("[Xendit Webhook Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
