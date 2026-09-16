// src/app/api/cron/orders-expiry/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";
import { writeAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "topupgame_cron_secret_key_123";
  const providedToken = authHeader?.replace("Bearer ", "") || req.headers.get("x-cron-secret");

  if (providedToken !== cronSecret && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized cron execution" }, { status: 401 });
  }

  try {
    const now = new Date();

    // 1. Expire Topup Orders
    const expiredTopup = await db
      .update(schema.ordersTopup)
      .set({ status: "EXPIRED", updatedAt: now })
      .where(
        and(
          eq(schema.ordersTopup.status, "PENDING_PAYMENT"),
          lt(schema.ordersTopup.expiresAt, now)
        )
      )
      .returning({ id: schema.ordersTopup.id, invoiceId: schema.ordersTopup.invoiceId });

    // 2. Expire Joki Orders
    const expiredJoki = await db
      .update(schema.ordersJoki)
      .set({ status: "CANCELLED", updatedAt: now })
      .where(
        and(
          eq(schema.ordersJoki.status, "PENDING_PAYMENT"),
          lt(schema.ordersJoki.createdAt, new Date(now.getTime() - 60 * 60 * 1000))
        )
      )
      .returning({ id: schema.ordersJoki.id, invoiceId: schema.ordersJoki.invoiceId });

    if (expiredTopup.length > 0 || expiredJoki.length > 0) {
      await writeAuditLog({
        actorId: null,
        actorRole: "cron_worker",
        action: "UPDATE",
        entityType: "orders_expiry",
        afterData: {
          expiredTopupCount: expiredTopup.length,
          expiredJokiCount: expiredJoki.length,
          invoices: [...expiredTopup.map((o) => o.invoiceId), ...expiredJoki.map((o) => o.invoiceId)],
        },
      });
    }

    return NextResponse.json({
      success: true,
      expiredTopupCount: expiredTopup.length,
      expiredJokiCount: expiredJoki.length,
      timestamp: now.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
