"use client";

import * as React from "react";
import { Layers, AlertTriangle, ArrowUpRight, ArrowDownRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminStockPage() {
  const [logs, setLogs] = React.useState([
    {
      id: "stk-1",
      sku: "ML-172-DM",
      productLabel: "172 Diamonds (MLBB)",
      delta: -1,
      beforeQty: 351,
      afterQty: 350,
      reason: "ORDER",
      refCode: "TUG-2025-000431",
      createdAt: "2025-05-10T14:02:16Z",
    },
    {
      id: "stk-2",
      sku: "VAL-1375-VP",
      productLabel: "1.375 VP (Valorant)",
      delta: 50,
      beforeQty: 100,
      afterQty: 150,
      reason: "SYNC",
      refCode: "SUP-DIGIFLAZZ-SYNC",
      createdAt: "2025-05-10T13:30:00Z",
    },
    {
      id: "stk-3",
      sku: "FF-355-DM",
      productLabel: "355 Diamonds (Free Fire)",
      delta: 200,
      beforeQty: 200,
      afterQty: 400,
      reason: "OPNAME",
      refCode: "ADMIN-BAGAS-ADJUST",
      createdAt: "2025-05-10T10:00:00Z",
    },
  ]);

  const [opnameOpen, setOpnameOpen] = React.useState(false);

  const handleOpnameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpnameOpen(false);
    toast.success("Stok opname manual berhasil dicatat ke stock_logs & audit_logs!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Kelola Stok &amp; Riwayat Mutasi
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log perubahan kuota voucher, sinkronisasi otomatis supplier, dan penyesuaian opname manual
          </p>
        </div>

        <Button
          onClick={() => setOpnameOpen(true)}
          size="sm"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Penyesuaian Stok Opname
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">
            Total Item SKU Aktif
          </span>
          <div className="font-mono font-extrabold text-2xl text-foreground">
            36 SKU
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tersebar di 6 game utama
          </p>
        </Card>

        <Card className="rounded-2xl border-destructive/30 bg-destructive/5 p-5 space-y-2">
          <span className="text-xs text-destructive font-bold">
            Alert Stok Kritis (&lt;100)
          </span>
          <div className="font-mono font-extrabold text-2xl text-destructive">
            2 Produk
          </div>
          <p className="text-[11px] text-muted-foreground">
            MLBB 2195 DM (80 sisa), VAL 2400 VP (90 sisa)
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">
            Status Sinkronisasi Stok
          </span>
          <div className="font-bold text-xl text-emerald-500">
            Realtime Auto (5m)
          </div>
          <p className="text-[11px] text-muted-foreground">
            Koneksi ke Digiflazz &amp; VIP Reseller normal
          </p>
        </Card>
      </div>

      {/* Mutasi Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-sm">Riwayat Mutasi Stok Produk</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU &amp; Produk</TableHead>
              <TableHead>Perubahan (Delta)</TableHead>
              <TableHead>Sebelum</TableHead>
              <TableHead>Sesudah</TableHead>
              <TableHead>Alasan Mutasi</TableHead>
              <TableHead>Referensi Order / Petugas</TableHead>
              <TableHead className="text-right">Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <strong className="font-mono text-xs text-primary block">
                    {item.sku}
                  </strong>
                  <span className="text-xs text-muted-foreground">
                    {item.productLabel}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-bold font-mono text-xs flex items-center gap-0.5 ${
                      item.delta > 0 ? "text-emerald-500" : "text-destructive"
                    }`}
                  >
                    {item.delta > 0 ? `+${item.delta}` : item.delta}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.beforeQty}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {item.afterQty}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {item.reason}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.refCode}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {formatDate(item.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Opname */}
      <Dialog open={opnameOpen} onOpenChange={setOpnameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Penyesuaian Stok Opname</DialogTitle>
            <DialogDescription>
              Ubah jumlah kuota stok secara manual (akan dicatat ke audit_logs)
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOpnameSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <Label>Pilih Produk SKU</Label>
              <select className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs">
                <option>ML-86-DM (86 Diamonds)</option>
                <option>ML-172-DM (172 Diamonds)</option>
                <option>VAL-420-VP (420 VP)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label>Stok Baru (Sesudah Opname)</Label>
              <Input type="number" defaultValue="500" className="h-9 text-xs font-mono" />
            </div>

            <div className="space-y-1">
              <Label>Catatan / Alasan Perubahan *</Label>
              <Input placeholder="Contoh: Penyesuaian stok deposit supplier manual" className="h-9 text-xs" required />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpnameOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="shadow-glow">
                Simpan Penyesuaian
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
