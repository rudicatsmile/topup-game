"use client";

import * as React from "react";
import { Plus, Ticket, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DUMMY_VOUCHERS } from "@/lib/dummy-data";
import { VoucherItem } from "@/lib/types";
import { formatRupiah, formatShortDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = React.useState<VoucherItem[]>(DUMMY_VOUCHERS);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Form State
  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = React.useState(20);
  const [maxDiscount, setMaxDiscount] = React.useState(10000);
  const [minSpend, setMinSpend] = React.useState(30000);
  const [quotaTotal, setQuotaTotal] = React.useState(500);
  const [scope, setScope] = React.useState<"ALL" | "TOPUP" | "JOKI">("ALL");

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error("Kode voucher wajib diisi.");
      return;
    }

    const newV: VoucherItem = {
      id: `v-${Date.now()}`,
      code: code.toUpperCase().trim(),
      type: type,
      value: Number(value),
      maxDiscount: type === "PERCENT" ? Number(maxDiscount) : undefined,
      minSpend: Number(minSpend),
      quotaTotal: Number(quotaTotal),
      quotaUsed: 0,
      scope: scope,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
      isActive: true,
    };

    setVouchers([newV, ...vouchers]);
    setDialogOpen(false);
    toast.success(`Voucher promo ${code} berhasil dibuat!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Kelola Voucher &amp; Promo Diskon
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Buat kode kupon promosi, atur batasan kuota penggunaan, dan masa berlaku
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          size="sm"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Buat Voucher Baru
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Kupon</TableHead>
              <TableHead>Tipe &amp; Nilai</TableHead>
              <TableHead>Maks. Diskon</TableHead>
              <TableHead>Min. Transaksi</TableHead>
              <TableHead>Kuota Terpakai</TableHead>
              <TableHead>Cakupan</TableHead>
              <TableHead>Masa Berlaku</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-mono font-bold text-xs text-primary">
                  {v.code}
                </TableCell>
                <TableCell className="text-xs font-semibold">
                  {v.type === "PERCENT"
                    ? `Diskon ${v.value}%`
                    : `Potongan ${formatRupiah(v.value)}`}
                </TableCell>
                <TableCell className="font-price text-xs">
                  {v.maxDiscount ? formatRupiah(v.maxDiscount) : "-"}
                </TableCell>
                <TableCell className="font-price text-xs">
                  {formatRupiah(v.minSpend)}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  {v.quotaUsed} / {v.quotaTotal}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {v.scope}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  s/d {formatShortDate(v.validUntil)}
                </TableCell>
                <TableCell>
                  <Switch checked={v.isActive} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Add Voucher */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Kode Voucher Baru</DialogTitle>
            <DialogDescription>
              Tentukan kode unik dan aturan potongan harga
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateVoucher} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Kode Kupon *</Label>
                <Input
                  placeholder="HEMAT50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label>Cakupan Layanan</Label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
                >
                  <option value="ALL">Semua Layanan</option>
                  <option value="TOPUP">Khusus Top-Up</option>
                  <option value="JOKI">Khusus Joki Rank</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Tipe Diskon</Label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
                >
                  <option value="PERCENT">Persentase (%)</option>
                  <option value="FIXED">Nominal Tetap (Rp)</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label>Nilai Diskon *</Label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="text-xs font-bold font-price"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Maksimal Diskon (Rp)</Label>
                <Input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="text-xs font-price"
                />
              </div>

              <div className="space-y-1">
                <Label>Min. Belanja (Rp)</Label>
                <Input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="text-xs font-price"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Kuota Total Pemakaian</Label>
              <Input
                type="number"
                value={quotaTotal}
                onChange={(e) => setQuotaTotal(Number(e.target.value))}
                className="text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="shadow-glow">
                Simpan Voucher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
