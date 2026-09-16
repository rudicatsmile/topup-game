"use client";

import Link from "next/link";
import { Flame, Clock, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_JOKI_ORDERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function UserJokiOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Riwayat Pesanan Joki Rank
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau progres kenaikan rank dan komunikasi langsung dengan mitra joki Anda
          </p>
        </div>
        <Button asChild size="sm" variant="accent" className="shadow-glow-accent">
          <Link href="/joki">Order Joki Baru</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {DUMMY_JOKI_ORDERS.map((order) => (
          <Card
            key={order.id}
            className="rounded-2xl border-border bg-card overflow-hidden hover:border-accent/50 transition-all p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary">
                    {order.invoiceId}
                  </span>
                  {order.status === "ON_PROGRESS" ? (
                    <Badge variant="accent" className="text-[10px]">
                      SEDANG BERJALAN
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">
                      SELESAI (100%)
                    </Badge>
                  )}
                </div>
                <h3 className="font-heading font-bold text-base mt-1 text-foreground">
                  {order.gameName} — {order.startTierName} ke {order.targetTierName}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">
                    Total Biaya
                  </span>
                  <span className="font-price font-bold text-base text-accent">
                    {formatRupiah(order.total)}
                  </span>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/joki/${order.id}`}>
                    Lihat Progres &amp; Chat
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Worker: <strong>{order.workerName}</strong> • Posisi Saat Ini:{" "}
                  <strong>{order.currentTierName}</strong>
                </span>
                <span className="font-bold text-accent font-price">
                  {order.progressPercent}% Selesai
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${order.progressPercent}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
