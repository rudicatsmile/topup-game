// src/app/api/cron/suppliers-sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { syncSupplierStockAndPrices } from "@/lib/suppliers/dispatcher";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "topupgame_cron_secret_key_123";
  const providedToken = authHeader?.replace("Bearer ", "") || req.headers.get("x-cron-secret");

  if (providedToken !== cronSecret && process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false, error: "Unauthorized cron execution" }, { status: 401 });
  }

  const result = await syncSupplierStockAndPrices();
  return NextResponse.json(result);
}
