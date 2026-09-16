"use client";

import Link from "next/link";
import {
  Flame,
  CheckCircle2,
  Wallet,
  Star,
  Trophy,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_JOKI_ORDERS } from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";

export default function JokiDashboardOverviewPage() {
  const activeOrders = DUMMY_JOKI_ORDERS.filter((o) => o.status === "ON_PROGRESS");

  return (
    <div className="space-y-8">
      {/* Header Profile */}
      <div className="rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/15 via-card to-primary/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-accent text-accent-foreground font-extrabold text-2xl flex items-center justify-center shadow-glow-accent ring-2 ring-accent">
              VM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  Panel Kerja Mitra Joki
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground mt-0.5">
                Andika "ViperML"
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Spesialis Mobile Legends &bull; Mythic 100★ Verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button asChild size="sm" variant="accent" className="shadow-glow-accent">
              <Link href="/joki-panel/orders">
                <Flame className="h-4 w-4 mr-1.5" />
                Lihat Order Aktif ({activeOrders.length})
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Order Aktif
            </span>
            <div className="h-8 w-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-accent">
              2 Pesanan
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Batas beban kerja: Maks. 3 order
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Rating Kepuasan
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-foreground">
              4.95 / 5.0
            </span>
            <span className="text-xs text-emerald-500 font-semibold">Top 1%</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Berdasarkan 143 review pelanggan
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Win Rate Match Joki
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-foreground">
              88.4%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Rata-rata 1 match = 14 menit
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Komisi Bulan Ini
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-emerald-500">
              {formatRupiah(3850000)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Bagi hasil 75% otomatis
          </p>
        </Card>
      </div>

      {/* Active Orders List */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <CardTitle className="text-base font-heading">
            Order Joki yang Sedang Dikerjakan
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/joki-panel/orders">Kelola Semua Order &rarr;</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {DUMMY_JOKI_ORDERS.map((ord) => (
            <div
              key={ord.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-primary">
                    {ord.invoiceId}
                  </span>
                  <Badge variant={ord.status === "ON_PROGRESS" ? "accent" : "success"} className="text-[10px]">
                    {ord.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  {ord.gameName} — {ord.startTierName} ke {ord.targetTierName}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Pembeli: {ord.userName} ({ord.userPhone}) • Catatan: "{ord.notes}"
                </p>

                {/* Progress bar */}
                <div className="pt-2 max-w-md space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      Posisi: <strong>{ord.currentTierName}</strong>
                    </span>
                    <span className="font-bold text-accent">
                      {ord.progressPercent}% Selesai
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${ord.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">
                    Komisi Joki (75%)
                  </span>
                  <span className="font-price font-bold text-sm text-emerald-500">
                    {formatRupiah(ord.workerCommission || 105000)}
                  </span>
                </div>
                <Button asChild size="sm" variant="accent">
                  <Link href={`/joki-panel/orders/${ord.id}`}>
                    Update Progres
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
