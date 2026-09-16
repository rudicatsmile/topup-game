"use client";

import * as React from "react";
import Link from "next/link";
import { Ticket, Copy, Check, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_VOUCHERS } from "@/lib/dummy-data";
import { formatRupiah, formatShortDate } from "@/lib/utils";
import { toast } from "sonner";

export default function UserVouchersPage() {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Kode kupon ${code} disalin!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Voucher &amp; Kupon Saya
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar voucher diskon yang siap kamu gunakan saat checkout pesanan
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/promo">Cari Promo Baru</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DUMMY_VOUCHERS.map((v) => {
          const isCopied = copiedCode === v.code;
          return (
            <Card
              key={v.id}
              className="rounded-2xl border-border bg-card p-5 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="gaming" className="text-[10px]">
                    {v.scope}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    s/d {formatShortDate(v.validUntil)}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xl text-foreground">
                  {v.type === "PERCENT"
                    ? `Diskon ${v.value}%`
                    : `Diskon ${formatRupiah(v.value)}`}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Min. Belanja {formatRupiah(v.minSpend)}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-primary">
                  {v.code}
                </span>
                <Button
                  size="sm"
                  variant={isCopied ? "accent" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => handleCopy(v.code)}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Salin
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
