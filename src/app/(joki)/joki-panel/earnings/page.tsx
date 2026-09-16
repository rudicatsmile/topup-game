"use client";

import * as React from "react";
import { Wallet, ArrowDownCircle, CheckCircle2, Clock, DollarSign } from "lucide-react";
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
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function JokiEarningsPage() {
  const [withdrawModalOpen, setWithdrawModalOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("500000");
  const [bankAccount, setBankAccount] = React.useState("BCA - 1234567890 (Andika)");

  const handleWithdraw = () => {
    setWithdrawModalOpen(false);
    toast.success("Pengajuan penarikan dana berhasil dikirimkan ke tim keuangan!");
  };

  const earningHistory = [
    {
      id: "e-1",
      invoiceId: "TUG-JKI-2025-000112",
      game: "Mobile Legends",
      rankTier: "Legend V → Mythic",
      orderValue: 150000,
      commissionPct: 75,
      netCommission: 105000,
      status: "TERBAYAR",
      date: "10 Mei 2025",
    },
    {
      id: "e-2",
      invoiceId: "TUG-JKI-2025-000098",
      game: "Valorant",
      rankTier: "Silver 3 → Gold 3",
      orderValue: 180000,
      commissionPct: 75,
      netCommission: 135000,
      status: "TERBAYAR",
      date: "7 Mei 2025",
    },
    {
      id: "e-3",
      invoiceId: "TUG-JKI-2025-000084",
      game: "Mobile Legends",
      rankTier: "Epic I → Legend V",
      orderValue: 85000,
      commissionPct: 75,
      netCommission: 63750,
      status: "TERBAYAR",
      date: "4 Mei 2025",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Pendapatan &amp; Komisi Mitra Joki
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rekap pembagian hasil komisi transparan dan penarikan saldo Anda
          </p>
        </div>

        <Button
          onClick={() => setWithdrawModalOpen(true)}
          size="sm"
          variant="accent"
          className="shadow-glow-accent"
        >
          <ArrowDownCircle className="h-4 w-4 mr-1.5" />
          Tarik Saldo Komisi
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">
            Saldo Tersedia (Siap Tarik)
          </span>
          <div className="font-price font-extrabold text-2xl text-emerald-500">
            {formatRupiah(850000)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Bisa ditarik ke rekening bank atau e-wallet kapan saja
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">
            Total Pendapatan Bulan Ini
          </span>
          <div className="font-price font-extrabold text-2xl text-accent">
            {formatRupiah(3850000)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Dari total 28 order terselesaikan
          </p>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-5 space-y-2">
          <span className="text-xs text-muted-foreground font-medium">
            Persentase Komisi Anda
          </span>
          <div className="font-price font-extrabold text-2xl text-primary">
            75.00%
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tier Mitra Senior (Top Global Performer)
          </p>
        </Card>
      </div>

      {/* Table Earning History */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-sm">Riwayat Komisi per Pesanan</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Game &amp; Rank</TableHead>
              <TableHead>Nilai Order</TableHead>
              <TableHead>Bagi Hasil</TableHead>
              <TableHead>Komisi Bersih</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Tanggal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earningHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono font-bold text-xs text-primary">
                  {item.invoiceId}
                </TableCell>
                <TableCell>
                  <strong className="text-xs text-foreground block">
                    {item.game}
                  </strong>
                  <span className="text-[11px] text-muted-foreground">
                    {item.rankTier}
                  </span>
                </TableCell>
                <TableCell className="font-price text-xs">
                  {formatRupiah(item.orderValue)}
                </TableCell>
                <TableCell className="text-xs font-semibold text-accent">
                  {item.commissionPct}%
                </TableCell>
                <TableCell className="font-price font-bold text-xs text-emerald-500">
                  {formatRupiah(item.netCommission)}
                </TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px]">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Withdraw Modal */}
      <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tarik Saldo Komisi Joki</DialogTitle>
            <DialogDescription>
              Dana akan ditransfer langsung ke rekening terdaftar dalam waktu maksimal 1 jam kerja.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Rekening Tujuan</Label>
              <Input value={bankAccount} disabled className="bg-muted text-xs font-bold" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Jumlah Penarikan (Rp)</Label>
              <Input
                id="amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="font-price font-bold text-accent"
              />
              <span className="text-[10px] text-muted-foreground">
                Saldo tersedia saat ini: {formatRupiah(850000)} (Min. Rp 50.000)
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleWithdraw} variant="accent" className="shadow-glow-accent">
              Konfirmasi Penarikan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
