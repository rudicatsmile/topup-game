"use client";

import * as React from "react";
import { BarChart3, Download, Calendar, ArrowUpRight, DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = React.useState("BULAN_INI");

  const handleExportCSV = () => {
    toast.success("File laporan penjualan 'Laporan_TopUpGame_Mei_2025.csv' berhasil diunduh!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Laporan Penjualan &amp; Rekap Keuangan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Analisis gross revenue, biaya gateway, bagi hasil joki, dan laba bersih (net profit)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleExportCSV} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1.5" />
            Ekspor CSV / Excel
          </Button>
        </div>
      </div>

      {/* Date Filter Strip */}
      <div className="flex flex-wrap items-center gap-2">
        {["HARI_INI", "7_HARI", "BULAN_INI", "TAHUN_INI"].map((key) => (
          <Button
            key={key}
            variant={dateRange === key ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs rounded-lg"
            onClick={() => setDateRange(key)}
          >
            {key.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border bg-card p-5 space-y-1.5">
          <span className="text-xs text-muted-foreground font-medium">
            Total Omset (Gross Revenue)
          </span>
          <div className="font-price font-extrabold text-2xl text-foreground">
            {formatRupiah(342500000)}
          </div>
          <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
            +24.8% dibanding bulan lalu <ArrowUpRight className="h-3 w-3" />
          </span>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-1.5">
          <span className="text-xs text-muted-foreground font-medium">
            HPP Modal Supplier
          </span>
          <div className="font-price font-extrabold text-2xl text-muted-foreground">
            {formatRupiah(285400000)}
          </div>
          <span className="text-[11px] text-muted-foreground">
            Digiflazz + VIP Reseller API
          </span>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-1.5">
          <span className="text-xs text-muted-foreground font-medium">
            Total Komisi Mitra Joki
          </span>
          <div className="font-price font-extrabold text-2xl text-accent">
            {formatRupiah(18250000)}
          </div>
          <span className="text-[11px] text-muted-foreground">
            75% bagi hasil worker
          </span>
        </Card>

        <Card className="rounded-2xl border-emerald-500/40 bg-emerald-500/5 p-5 space-y-1.5">
          <span className="text-xs text-emerald-500 font-bold">
            Laba Bersih (Net Profit)
          </span>
          <div className="font-price font-extrabold text-2xl text-emerald-500">
            {formatRupiah(38850000)}
          </div>
          <span className="text-[11px] text-emerald-500 font-bold">
            Margin Bersih: 11.34%
          </span>
        </Card>
      </div>

      {/* Top Selling Games Bar Breakdown */}
      <Card className="rounded-2xl border-border bg-card p-6 space-y-4">
        <h3 className="font-heading font-bold text-base">
          Distribusi Omset Berdasarkan Judul Game
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-bold mb-1">
              <span>Mobile Legends: Bang Bang (62%)</span>
              <span className="font-price text-accent">{formatRupiah(212350000)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "62%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span>Free Fire (18%)</span>
              <span className="font-price text-accent">{formatRupiah(61650000)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "18%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span>Valorant Points (12%)</span>
              <span className="font-price text-accent">{formatRupiah(41100000)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold mb-1">
              <span>Game Lainnya (8%)</span>
              <span className="font-price text-accent">{formatRupiah(27400000)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-zinc-500 rounded-full" style={{ width: "8%" }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
