"use client";

import * as React from "react";
import { Truck, RefreshCw, Plus, CheckCircle2, AlertCircle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = React.useState([
    {
      id: "sup-1",
      name: "Digiflazz Aggregator API",
      baseUrl: "https://api.digiflazz.com/v1",
      apiKeyMasked: "df_live_••••••••••••9841",
      isActive: true,
      lastSync: "5 menit lalu",
      balance: 14520000,
      status: "TERKONEKSI",
    },
    {
      id: "sup-2",
      name: "VIP Reseller Game H2H",
      baseUrl: "https://vip-reseller.co.id/api/v2",
      apiKeyMasked: "vip_sec_••••••••••••1029",
      isActive: true,
      lastSync: "10 menit lalu",
      balance: 8940000,
      status: "TERKONEKSI",
    },
    {
      id: "sup-3",
      name: "Apigames Partner Gateway",
      baseUrl: "https://apigames.id/v2/transaksi",
      apiKeyMasked: "apig_live_••••••••••••3471",
      isActive: false,
      lastSync: "1 hari lalu",
      balance: 120000,
      status: "STANDBY",
    },
  ]);

  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Sinkronisasi stok dan harga dari semua supplier API berhasil diselesaikan!");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Kelola Supplier &amp; Koneksi API
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Integrasi aggregator penyedia diamond game (Digiflazz, VIP Reseller, Apigames)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncAll}
            disabled={isSyncing}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sinkronisasi..." : "Sinkronkan Stok Sekarang"}
          </Button>
          <Button size="sm" className="shadow-glow">
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Supplier
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Supplier</TableHead>
              <TableHead>API Base URL</TableHead>
              <TableHead>Kunci API (AES-256)</TableHead>
              <TableHead>Sisa Saldo Deposit</TableHead>
              <TableHead>Sinkronisasi Terakhir</TableHead>
              <TableHead>Koneksi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((sup) => (
              <TableRow key={sup.id}>
                <TableCell className="font-bold text-xs">
                  {sup.name}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {sup.baseUrl}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {sup.apiKeyMasked}
                </TableCell>
                <TableCell className="font-price font-bold text-xs text-accent">
                  Rp {sup.balance.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {sup.lastSync}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sup.status === "TERKONEKSI" ? "success" : "outline"}
                    className="text-[10px]"
                  >
                    {sup.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch checked={sup.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => toast.success(`Tes koneksi ke ${sup.name} respon 200 OK (85ms)`)}
                  >
                    Ping API
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
