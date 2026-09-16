"use client";

import Link from "next/link";
import {
  Zap,
  ShoppingBag,
  Flame,
  Ticket,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_TOPUP_ORDERS,
  DUMMY_JOKI_ORDERS,
  DUMMY_GAMES,
} from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function UserDashboardOverviewPage() {
  const recentOrders = DUMMY_TOPUP_ORDERS.slice(0, 3);
  const activeJokiOrder = DUMMY_JOKI_ORDERS[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/15 via-card to-accent/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Selamat Datang Kembali
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
              Halo, Rizky Aditya Pratama! 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pantau seluruh transaksi diamond dan progres joki rank kamu di satu tempat.
            </p>
          </div>
          <Button asChild size="lg" className="shadow-glow shrink-0">
            <Link href="/top-up">
              <Zap className="h-4 w-4 mr-2" />
              Top-Up Game Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Poin Reward
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Ticket className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-foreground">
              1.250
            </span>
            <span className="text-xs text-emerald-500 font-semibold">+150 bulan ini</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Bisa ditukar dengan kupon potongan harga
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Total Transaksi
            </span>
            <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-foreground">
              12 Pesanan
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            100% Pembayaran Terverifikasi
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Order Joki Aktif
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Flame className="h-4 w-4 text-accent" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-accent">
              1 Berjalan
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Legend V → Mythic (85% Selesai)
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Status Member
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-xl text-emerald-500">
              Verified Gold
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Cashback ekstra 2% tiap transaksi
          </p>
        </Card>
      </div>

      {/* Active Joki Order Highlight Card */}
      {activeJokiOrder && (
        <Card className="rounded-2xl border-accent/40 bg-accent/5 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="accent" className="font-bold">
                  JOKI ON PROGRESS
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {activeJokiOrder.invoiceId}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg mt-1">
                {activeJokiOrder.gameName} — {activeJokiOrder.startTierName} ke {activeJokiOrder.targetTierName}
              </h3>
            </div>
            <Button asChild variant="accent" size="sm" className="shadow-glow-accent">
              <Link href={`/dashboard/joki/${activeJokiOrder.id}`}>
                Buka Chat &amp; Progres Joki
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Worker Ditugaskan: <strong>{activeJokiOrder.workerName}</strong>
              </span>
              <span className="font-bold text-accent font-price">
                {activeJokiOrder.progressPercent}% Selesai
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${activeJokiOrder.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Posisi Terkini: {activeJokiOrder.currentTierName}</span>
              <span>Estimasi Selesai: Hari ini, ~18.00 WIB</span>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Top-Up Orders Table */}
      <Card className="rounded-2xl border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
          <CardTitle className="text-base font-heading">
            Riwayat Transaksi Top-Up Terakhir
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold">
            <Link href="/dashboard/orders">
              Lihat Semua ({DUMMY_TOPUP_ORDERS.length})
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border text-sm">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-primary">
                      {ord.invoiceId}
                    </span>
                    {ord.status === "SUCCESS" ? (
                      <Badge variant="success" className="text-[10px]">
                        SUKSES
                      </Badge>
                    ) : ord.status === "PROCESSING" ? (
                      <Badge variant="accent" className="text-[10px]">
                        DIPROSES
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">
                        PENDING
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-foreground">
                    {ord.gameName} — {ord.productLabel}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Tujuan: {ord.gameUserId} {ord.gameZoneId ? `(${ord.gameZoneId})` : ""} • {formatDate(ord.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="font-price font-bold text-sm text-foreground">
                    {formatRupiah(ord.total)}
                  </span>
                  <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                    <Link href={`/dashboard/orders/${ord.id}`}>
                      Detail
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
