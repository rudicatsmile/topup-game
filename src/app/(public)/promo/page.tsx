"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, Ticket, Calendar, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_VOUCHERS } from "@/lib/dummy-data";
import { formatRupiah, formatShortDate } from "@/lib/utils";
import { toast } from "sonner";

export default function PromoPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Kode voucher ${code} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/20 via-card to-accent/15 p-8 sm:p-12">
        <div className="max-w-2xl space-y-3">
          <Badge variant="accent" className="font-bold">
            DISKON &amp; CASHBACK SPESIAL
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Klaim Voucher &amp; Promo Eksklusif
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Hemat hingga puluhan ribu rupiah untuk transaksi top-up diamond dan layanan joki rank favoritmu. Salin kode dan gunakan saat checkout!
          </p>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_VOUCHERS.map((v) => {
          const isCopied = copiedCode === v.code;
          const quotaPercent = Math.round((v.quotaUsed / v.quotaTotal) * 100);

          return (
            <Card
              key={v.id}
              className="relative overflow-hidden rounded-2xl border-border bg-card flex flex-col justify-between shadow-sm hover:border-primary/50 transition-all hover:shadow-glow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gaming" className="font-bold text-xs uppercase">
                    {v.scope === "ALL"
                      ? "Semua Layanan"
                      : v.scope === "TOPUP"
                      ? "Khusus Top-Up"
                      : "Khusus Joki Rank"}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    s/d {formatShortDate(v.validUntil)}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-2xl font-heading text-foreground">
                    {v.type === "PERCENT"
                      ? `Diskon ${v.value}%`
                      : `Potongan ${formatRupiah(v.value)}`}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Min. Transaksi {formatRupiah(v.minSpend)}{" "}
                    {v.maxDiscount
                      ? `(Maks. Diskon ${formatRupiah(v.maxDiscount)})`
                      : ""}
                  </p>
                </div>

                {/* Quota Progress */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Kuota Terpakai</span>
                    <span className="font-bold text-accent">
                      {v.quotaUsed} / {v.quotaTotal} ({quotaPercent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Voucher Code Bar */}
              <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  <span className="font-mono font-bold text-sm tracking-wider text-primary">
                    {v.code}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={isCopied ? "accent" : "outline"}
                  className="h-8 text-xs font-semibold"
                  onClick={() => handleCopy(v.code)}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-black" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Salin Kode
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="font-heading font-bold text-lg sm:text-xl">
          Sudah Memilih Voucher?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Gunakan langsung saat melakukan pembayaran di halaman top-up game favoritmu untuk mendapatkan potongan harga seketika.
        </p>
        <Button asChild size="lg" className="shadow-glow">
          <Link href="/top-up">
            Top-Up Game Sekarang
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
