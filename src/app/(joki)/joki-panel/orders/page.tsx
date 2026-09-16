"use client";

import Link from "next/link";
import { Flame, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_JOKI_ORDERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function JokiOrdersListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">
          Daftar Order Joki Ditugaskan
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola pesanan joki yang masuk dan perbarui progres pertandingan Anda secara berkala
        </p>
      </div>

      <div className="space-y-4">
        {DUMMY_JOKI_ORDERS.map((ord) => (
          <Card
            key={ord.id}
            className="rounded-2xl border-border bg-card p-6 space-y-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary">
                    {ord.invoiceId}
                  </span>
                  <Badge variant={ord.status === "ON_PROGRESS" ? "accent" : "success"} className="text-[10px]">
                    {ord.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-base mt-1 text-foreground font-heading">
                  {ord.gameName} — {ord.startTierName} ke {ord.targetTierName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Akun: <strong>{ord.accountEmail}</strong> • Pembeli: {ord.userName}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">
                    Hak Komisi Anda
                  </span>
                  <span className="font-price font-bold text-base text-emerald-500">
                    {formatRupiah(ord.workerCommission || 105000)}
                  </span>
                </div>
                <Button asChild size="sm" variant="accent">
                  <Link href={`/joki-panel/orders/${ord.id}`}>
                    Kelola &amp; Update
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>
                  Posisi Rank Terkini: <strong>{ord.currentTierName}</strong>
                </span>
                <span className="font-bold text-accent">
                  {ord.progressPercent}% Selesai
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${ord.progressPercent}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
