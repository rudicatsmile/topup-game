// src/app/api/orders/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { DUMMY_TOPUP_ORDERS, DUMMY_JOKI_ORDERS } from "@/lib/dummy-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim().toUpperCase();

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Nomor Invoice wajib disertakan" },
      { status: 400 }
    );
  }

  try {
    // 1. Check topup orders in DB
    const topupMatches = await db
      .select()
      .from(schema.ordersTopup)
      .where(eq(schema.ordersTopup.invoiceId, id))
      .limit(1);

    if (topupMatches.length > 0) {
      return NextResponse.json({
        success: true,
        type: "topup",
        order: topupMatches[0],
      });
    }

    // 2. Check joki orders in DB
    const jokiMatches = await db
      .select()
      .from(schema.ordersJoki)
      .where(eq(schema.ordersJoki.invoiceId, id))
      .limit(1);

    if (jokiMatches.length > 0) {
      return NextResponse.json({
        success: true,
        type: "joki",
        order: jokiMatches[0],
      });
    }
  } catch {}

  // 3. Fallback dummy match
  const dummyTopup = DUMMY_TOPUP_ORDERS.find(
    (o) => o.invoiceId.toUpperCase() === id || o.id.toUpperCase() === id
  );
  if (dummyTopup) {
    return NextResponse.json({
      success: true,
      type: "topup",
      order: dummyTopup,
    });
  }

  const dummyJoki = DUMMY_JOKI_ORDERS.find(
    (o) => o.invoiceId.toUpperCase() === id || o.id.toUpperCase() === id
  );
  if (dummyJoki) {
    return NextResponse.json({
      success: true,
      type: "joki",
      order: dummyJoki,
    });
  }

  return NextResponse.json(
    { success: false, error: `Pesanan dengan Invoice "${id}" tidak ditemukan.` },
    { status: 404 }
  );
}
