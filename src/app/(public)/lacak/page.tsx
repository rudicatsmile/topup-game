"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_TOPUP_ORDERS,
  DUMMY_JOKI_ORDERS,
} from "@/lib/dummy-data";
import { formatRupiah, formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LacakPesananPage() {
  const [invoiceQuery, setInvoiceQuery] = React.useState("TUG-2025-000431");
  const [searchResult, setSearchResult] = React.useState<any>(
    DUMMY_TOPUP_ORDERS[0]
  );
  const [isJoki, setIsJoki] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = invoiceQuery.trim().toUpperCase();
    if (!clean) {
      toast.error("Silakan masukkan nomor Invoice ID terlebih dahulu.");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setSearchResult(data.order);
        setIsJoki(data.type === "joki");
        toast.success(`Pesanan ${data.type === "joki" ? "joki rank" : "top-up"} ditemukan!`);
        return;
      }
    } catch {} finally {
      setIsSearching(false);
    }

    // Fallback search
    const foundTopup = DUMMY_TOPUP_ORDERS.find(
      (o) => o.invoiceId.toUpperCase() === clean
    );
    if (foundTopup) {
      setSearchResult(foundTopup);
      setIsJoki(false);
      toast.success("Pesanan top-up ditemukan!");
      return;
    }

    const foundJoki = DUMMY_JOKI_ORDERS.find(
      (o) => o.invoiceId.toUpperCase() === clean
    );
    if (foundJoki) {
      setSearchResult(foundJoki);
      setIsJoki(true);
      toast.success("Pesanan joki rank ditemukan!");
      return;
    }

    toast.error("Nomor invoice tidak ditemukan. Pastikan format penulisan benar (contoh: TUG-2025-000431).");
    setSearchResult(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="gaming" className="font-bold">
          PELACAKAN STATUS PESANAN PUBLIK
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Lacak Transaksi Kamu
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Cek status pesanan top-up diamond dan progres joki rank secara realtime tanpa perlu login.
        </p>
      </div>

      {/* Search Input Card */}
      <Card className="rounded-2xl border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Masukkan Nomor Invoice (misal: TUG-2025-000431)"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl uppercase font-mono tracking-wider font-semibold"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 font-bold shadow-glow"
            >
              Lacak Pesanan
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground pt-1">
            <span>Contoh Invoice Cepat:</span>
            <button
              type="button"
              onClick={() => {
                setInvoiceQuery("TUG-2025-000431");
                setSearchResult(DUMMY_TOPUP_ORDERS[0]);
                setIsJoki(false);
              }}
              className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 font-mono text-primary font-bold transition-colors"
            >
              TUG-2025-000431 (Top-Up Sukses)
            </button>
            <button
              type="button"
              onClick={() => {
                setInvoiceQuery("TUG-JKI-2025-000112");
                setSearchResult(DUMMY_JOKI_ORDERS[0]);
                setIsJoki(true);
              }}
              className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 font-mono text-accent font-bold transition-colors"
            >
              TUG-JKI-2025-000112 (Joki Progress)
            </button>
          </div>
        </form>
      </Card>

      {/* Tracking Result Card */}
      {searchResult && (
        <Card className="rounded-2xl border-border bg-card overflow-hidden shadow-md space-y-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <span className="text-xs text-muted-foreground block">
                Nomor Invoice Resmi:
              </span>
              <h2 className="text-xl font-extrabold font-mono tracking-wider text-foreground">
                {searchResult.invoiceId}
              </h2>
              <span className="text-xs text-muted-foreground mt-0.5 block">
                Waktu Transaksi: {formatDate(searchResult.createdAt)}
              </span>
            </div>

            <div>
              {searchResult.status === "SUCCESS" ||
              searchResult.status === "COMPLETED" ? (
                <Badge variant="success" className="px-3 py-1 text-xs font-bold">
                  ✓ TRANSAKSI SUKSES
                </Badge>
              ) : searchResult.status === "ON_PROGRESS" ||
                searchResult.status === "PROCESSING" ? (
                <Badge variant="accent" className="px-3 py-1 text-xs font-bold">
                  ⚡ SEDANG DIPROSES
                </Badge>
              ) : (
                <Badge variant="warning" className="px-3 py-1 text-xs font-bold">
                  ⏳ MENUNGGU PEMBAYARAN
                </Badge>
              )}
            </div>
          </div>

          {/* Stepper Status Visual */}
          <div className="py-2">
            <span className="text-xs font-bold text-muted-foreground block mb-4 uppercase tracking-wider">
              Tahapan Pemrosesan:
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-primary" />
                <span className="font-bold text-primary block">1. Dibuat</span>
                <span className="text-[10px] text-muted-foreground">Order Tercatat</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-primary" />
                <span className="font-bold text-primary block">2. Pembayaran</span>
                <span className="text-[10px] text-muted-foreground">Lunas Otomatis</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 rounded-full bg-primary" />
                <span className="font-bold text-primary block">3. Proses</span>
                <span className="text-[10px] text-muted-foreground">
                  {isJoki ? "Joki Bertanding" : "Kirim Diamond"}
                </span>
              </div>
              <div className="space-y-1.5">
                <div
                  className={cn(
                    "h-2 rounded-full",
                    searchResult.status === "SUCCESS" ||
                      searchResult.status === "COMPLETED"
                      ? "bg-emerald-500"
                      : "bg-muted"
                  )}
                />
                <span
                  className={cn(
                    "font-bold block",
                    searchResult.status === "SUCCESS" ||
                      searchResult.status === "COMPLETED"
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  )}
                >
                  4. Selesai
                </span>
                <span className="text-[10px] text-muted-foreground">Diamond Masuk</span>
              </div>
            </div>
          </div>

          {/* Transaction Detail Info */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Game / Layanan:</span>
              <span className="font-bold text-sm text-foreground">
                {searchResult.gameName}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block">Item / Target:</span>
              <span className="font-bold text-sm text-foreground">
                {isJoki
                  ? `${searchResult.startTierName} → ${searchResult.targetTierName}`
                  : searchResult.productLabel}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block">Akun Tujuan:</span>
              <span className="font-mono font-bold text-foreground">
                {isJoki
                  ? searchResult.accountEmail
                  : `${searchResult.gameUserId} (${searchResult.gameNickname || "-"})`}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block">Total Pembayaran:</span>
              <span className="font-price font-bold text-sm text-accent">
                {formatRupiah(searchResult.total)}
              </span>
            </div>
          </div>

          {/* Joki Specific Progress Bar if Joki */}
          {isJoki && (
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-foreground">
                  Progres Kenaikan Rank ({searchResult.workerName})
                </span>
                <span className="font-bold text-accent">
                  {searchResult.progressPercent}% Selesai
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${searchResult.progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground block">
                Posisi Saat Ini: <strong>{searchResult.currentTierName}</strong>
              </span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">
              Kendala pada pesanan ini?
            </span>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20cek%20pesanan%20${searchResult.invoiceId}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                Hubungi CS WhatsApp dengan ID ini
              </a>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
