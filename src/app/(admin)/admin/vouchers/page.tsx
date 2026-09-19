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
import {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "@/actions/catalog";
import { formatRupiah, formatShortDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = React.useState<VoucherItem[]>(DUMMY_VOUCHERS);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingVoucher, setEditingVoucher] = React.useState<VoucherItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Form State
  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState<"PERCENT" | "FIXED">("PERCENT");
  const [value, setValue] = React.useState(20);
  const [maxDiscount, setMaxDiscount] = React.useState<number | undefined>(10000);
  const [minSpend, setMinSpend] = React.useState(30000);
  const [quotaTotal, setQuotaTotal] = React.useState(500);
  const [scope, setScope] = React.useState<"ALL" | "TOPUP" | "JOKI">("ALL");

  // Load vouchers from Neon DB / actions on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getVouchers();
        if (isMounted && data && data.length > 0) {
          setVouchers(data);
        }
      } catch (err) {
        // Fallback to DUMMY_VOUCHERS silently
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVouchers = vouchers.filter((v) =>
    v.code.toLowerCase().includes(search.toLowerCase()) ||
    v.scope.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingVoucher(null);
    setCode("");
    setType("PERCENT");
    setValue(20);
    setMaxDiscount(10000);
    setMinSpend(30000);
    setQuotaTotal(500);
    setScope("ALL");
    setDialogOpen(true);
  };

  const handleOpenEdit = (v: VoucherItem) => {
    setEditingVoucher(v);
    setCode(v.code);
    setType(v.type);
    setValue(v.value);
    setMaxDiscount(v.maxDiscount);
    setMinSpend(v.minSpend);
    setQuotaTotal(v.quotaTotal);
    setScope(v.scope);
    setDialogOpen(true);
  };

  const handleToggleActive = async (id: string) => {
    const target = vouchers.find((v) => v.id === id);
    if (!target) return;
    const nextStatus = !target.isActive;

    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isActive: nextStatus } : v))
    );

    try {
      await updateVoucher(id, { isActive: nextStatus });
    } catch (err) {}

    toast.success(
      `Status voucher "${target.code}" diubah ke ${
        nextStatus ? "Aktif" : "Nonaktif"
      }!`
    );
  };

  const handleDeleteVoucher = async (id: string, voucherCode: string) => {
    if (
      !confirm(`Apakah Anda yakin ingin menghapus voucher promo "${voucherCode}"?`)
    ) {
      return;
    }

    setVouchers((prev) => prev.filter((v) => v.id !== id));

    try {
      await deleteVoucher(id);
    } catch (err) {}

    toast.success(`Voucher promo "${voucherCode}" berhasil dihapus.`);
  };

  const handleSaveVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) {
      toast.error("Kode voucher wajib diisi.");
      return;
    }
    if (value <= 0) {
      toast.error("Nilai diskon harus lebih besar dari 0.");
      return;
    }

    setIsSaving(true);
    try {
      const numValue = Number(value);
      const numMaxDiscount =
        type === "PERCENT" && maxDiscount !== undefined && maxDiscount !== null
          ? Number(maxDiscount)
          : undefined;
      const numMinSpend = Number(minSpend) || 0;
      const numQuota = Number(quotaTotal) || 100;

      if (editingVoucher) {
        // Mode EDIT
        const updated: VoucherItem = {
          ...editingVoucher,
          code: cleanCode,
          type: type,
          value: numValue,
          maxDiscount: numMaxDiscount,
          minSpend: numMinSpend,
          quotaTotal: numQuota,
          scope: scope,
        };

        setVouchers((prev) =>
          prev.map((v) => (v.id === editingVoucher.id ? updated : v))
        );

        try {
          await updateVoucher(editingVoucher.id, {
            code: cleanCode,
            type: type,
            value: numValue,
            maxDiscount: numMaxDiscount,
            minSpend: numMinSpend,
            quotaTotal: numQuota,
            scope: scope,
          });
        } catch (dbErr) {}

        setDialogOpen(false);
        setEditingVoucher(null);
        toast.success(`Voucher promo "${cleanCode}" berhasil diperbarui!`);
      } else {
        // Mode TAMBAH BARU
        const newV: VoucherItem = {
          id: `v-${Date.now()}`,
          code: cleanCode,
          type: type,
          value: numValue,
          maxDiscount: numMaxDiscount,
          minSpend: numMinSpend,
          quotaTotal: numQuota,
          quotaUsed: 0,
          scope: scope,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
          isActive: true,
        };

        setVouchers((prev) => [newV, ...prev]);

        try {
          await createVoucher({
            code: cleanCode,
            type: type,
            value: numValue,
            maxDiscount: numMaxDiscount,
            minSpend: numMinSpend,
            quotaTotal: numQuota,
            scope: scope,
          });
        } catch (dbErr) {}

        setDialogOpen(false);
        toast.success(`Voucher promo "${cleanCode}" berhasil dibuat!`);
      }
    } finally {
      setIsSaving(false);
    }
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
          onClick={handleOpenCreate}
          size="sm"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Buat Voucher Baru
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kode voucher atau cakupan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
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
            {filteredVouchers.map((v) => (
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
                  <Switch
                    checked={v.isActive}
                    onCheckedChange={() => handleToggleActive(v.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(v)}
                      title={`Edit ${v.code}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteVoucher(v.id, v.code)}
                      title={`Hapus ${v.code}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Add / Edit Voucher */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingVoucher(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVoucher
                ? `Edit Voucher: ${editingVoucher.code}`
                : "Buat Kode Voucher Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingVoucher
                ? "Perbarui kode promo diskon, batasan transaksi, dan kuota pemakaian"
                : "Tentukan kode unik dan aturan potongan harga"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveVoucher} className="space-y-4 py-2">
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
                <Label>
                  {type === "PERCENT"
                    ? "Persentase Diskon (%) *"
                    : "Nilai Potongan (Rp) *"}
                </Label>
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
                  placeholder={type === "PERCENT" ? "10000" : "Tidak ada limit"}
                  value={maxDiscount !== undefined && maxDiscount !== null ? maxDiscount : ""}
                  onChange={(e) =>
                    setMaxDiscount(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  disabled={type === "FIXED"}
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
                onClick={() => {
                  setDialogOpen(false);
                  setEditingVoucher(null);
                }}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="shadow-glow"
                disabled={isSaving}
              >
                {isSaving
                  ? "Menyimpan..."
                  : editingVoucher
                  ? "Simpan Perubahan"
                  : "Simpan Voucher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
