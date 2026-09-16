"use client";

import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Flame,
  CreditCard,
  AlertTriangle,
  Users,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_ADMIN_METRICS,
  DUMMY_TOPUP_ORDERS,
  DUMMY_JOKI_ORDERS,
  DUMMY_AUDIT_LOGS,
} from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function AdminOverviewDashboardPage() {
  const metrics = DUMMY_ADMIN_METRICS;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">
              Dasbor Manajemen TopUpGame
            </h1>
            <Badge variant="accent" className="font-mono text-xs">
              LIVE
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ringkasan omset harian, volume pesanan diamond &amp; joki rank, serta alert operasional
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/reports">Laporan Lengkap</Link>
          </Button>
          <Button asChild size="sm" className="shadow-glow">
            <Link href="/admin/payments">Verifikasi Manual (4)</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Omset Hari Ini (Gross)
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-emerald-500">
              {formatRupiah(metrics.todayRevenue)}
            </span>
            <span className="text-xs text-emerald-500 font-bold flex items-center">
              +19.7% <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Kemarin: {formatRupiah(metrics.yesterdayRevenue)}
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Transaksi Top-Up Hari Ini
            </span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-foreground">
              {metrics.totalOrdersToday}
            </span>
            <span className="text-xs text-muted-foreground">Order Sukses</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Success Rate Pembayaran: 98.2%
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Order Joki Berjalan
            </span>
            <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-price font-extrabold text-2xl text-accent">
              {metrics.activeJokiOrders}
            </span>
            <span className="text-xs text-accent font-semibold">Sedang Push</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Ditangani oleh 12 worker online
          </p>
        </Card>

        <Card className="rounded-2xl border-amber-500/40 bg-amber-500/5 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-500 font-bold">
              Butuh Tindakan Cepat
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Transfer Manual Pending:</span>
              <strong className="text-amber-500">{metrics.pendingManualPayments} Bukti</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span>Alert Stok Tipis (&lt;50):</span>
              <strong className="text-destructive">{metrics.lowStockAlerts} Produk</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column: Recent Transactions + Audit Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
              <CardTitle className="text-base font-heading">
                Transaksi Top-Up Masuk
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/admin/orders/topup">Semua Order &rarr;</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border text-xs">
              {DUMMY_TOPUP_ORDERS.slice(0, 4).map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">
                        {ord.invoiceId}
                      </span>
                      <span className="text-muted-foreground">• {ord.paymentMethodLabel}</span>
                    </div>
                    <span className="font-bold text-foreground block text-sm">
                      {ord.gameName} ({ord.productLabel})
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      User: {ord.userName} ({ord.gameUserId})
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="font-price font-bold text-sm text-foreground block">
                      {formatRupiah(ord.total)}
                    </span>
                    <Badge
                      variant={
                        ord.status === "SUCCESS"
                          ? "success"
                          : ord.status === "PROCESSING"
                          ? "accent"
                          : "warning"
                      }
                      className="text-[10px]"
                    >
                      {ord.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live Immutable Audit Logs Feed */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <CardTitle className="text-base font-heading">
                  Audit Log Terakhir
                </CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/admin/audit-logs">Audit Log Full &rarr;</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {DUMMY_AUDIT_LOGS.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-muted/40 border border-border space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {log.actorName} ({log.actorRole})
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono">
                      {log.action}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Entitas: <strong className="text-accent">{log.entityType}</strong> ({log.referenceCode})
                  </p>
                  <div className="text-[10px] text-muted-foreground/80 font-mono">
                    IP: {log.ipAddress} • {formatDate(log.createdAt)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
