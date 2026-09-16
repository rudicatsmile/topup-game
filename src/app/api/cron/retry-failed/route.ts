// src/app/api/cron/retry-failed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, lt } from "drizzle-orm";
import { dispatchSupplierOrder } from "@/lib/suppliers/dispatcher";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "topupgame_cron_secret_key_123";
  const providedToken = authHeader?.replace("Bearer ", "") || req.headers.get("x-cron-secret");

  if (providedToken !== cronSecret && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized cron execution" }, { status: 401 });
  }

  try {
    // Find processing orders that have not completed and have low retry count
    const pendingOrders = await db
      .select()
      .from(schema.ordersTopup)
      .where(
        and(
          eq(schema.ordersTopup.status, "PROCESSING"),
          lt(schema.ordersTopup.retryCount, 3)
        )
      )
      .limit(10);

    let retried = 0;
    for (const ord of pendingOrders) {
      await dispatchSupplierOrder(ord.id);
      retried++;
    }

    return NextResponse.json({ success: true, retriedCount: retried });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
