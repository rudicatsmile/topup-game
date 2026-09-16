"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Printer, ArrowLeft, Gamepad2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DUMMY_TOPUP_ORDERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function InvoicePrintablePage() {
  const params = useParams();
  const id = params?.id as string;
  const order = DUMMY_TOPUP_ORDERS.find((o) => o.id === id) || DUMMY_TOPUP_ORDERS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/orders/${order.id}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Kembali ke Detail Pesanan
          </Link>
        </Button>
        <Button onClick={handlePrint} size="sm" className="shadow-glow">
          <Printer className="h-4 w-4 mr-1.5" />
          Cetak / Unduh PDF
        </Button>
      </div>

      {/* Invoice Document Box */}
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight">
                TopUp<span className="text-primary">Game</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              PT TopUpGame Indonesia<br />
              Menara Cyber 2, Lantai 18, Jakarta Selatan<br />
              Email: support@topupgame.id • WA: +62 812-3456-7890
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              BUKTI PEMBAYARAN ELEKTRONIK
            </span>
            <h2 className="text-xl font-mono font-extrabold text-foreground">
              {order.invoiceId}
            </h2>
            <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-bold mt-1">
              ✓ LUNAS
            </span>
          </div>
        </div>

        {/* Billed To & Order Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">
              Diterbitkan Untuk:
            </span>
            <h4 className="font-bold text-sm text-foreground">
              {order.userName || "Rizky Aditya Pratama"}
            </h4>
            <p className="text-muted-foreground">
              Akun Game: {order.gameUserId} {order.gameZoneId ? `(${order.gameZoneId})` : ""}
            </p>
            <p className="text-muted-foreground">
              Nickname: {order.gameNickname || "RizkySlayer"}
            </p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">
              Detail Transaksi:
            </span>
            <p className="text-foreground">
              Tanggal: <strong>{formatDate(order.createdAt)}</strong>
            </p>
            <p className="text-foreground">
              Metode Bayar: <strong>{order.paymentMethodLabel || "Xendit QRIS"}</strong>
            </p>
            <p className="text-muted-foreground">
              Status Pengiriman: <strong className="text-emerald-500">Berhasil Dikirim</strong>
            </p>
          </div>
        </div>

        {/* Item Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="p-3">Deskripsi Item</th>
                <th className="p-3 text-center">Jumlah</th>
                <th className="p-3 text-right">Harga Satuan</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">
                  <strong className="text-foreground block">{order.gameName}</strong>
                  <span className="text-muted-foreground">{order.productLabel}</span>
                </td>
                <td className="p-3 text-center font-bold">{order.qty}</td>
                <td className="p-3 text-right font-price">
                  {formatRupiah(order.subtotal)}
                </td>
                <td className="p-3 text-right font-price font-bold">
                  {formatRupiah(order.subtotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculation Breakdown */}
        <div className="flex justify-end text-xs">
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal Item:</span>
              <span className="font-price text-foreground">
                {formatRupiah(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>Diskon Kupon:</span>
                <span className="font-price">
                  -{formatRupiah(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Biaya Layanan:</span>
              <span className="font-price text-foreground">
                {order.fee === 0 ? "Gratis" : formatRupiah(order.fee)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
              <span>Total Dibayar:</span>
              <span className="font-price text-accent text-base">
                {formatRupiah(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note & Security Stamp */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>
              Invoice ini merupakan bukti transaksi sah yang diterbitkan otomatis oleh sistem TopUpGame.
            </span>
          </div>
          <span className="font-mono text-muted-foreground/80">
            SECURE-HASH: SHA256-VALIDATED
          </span>
        </div>
      </div>
    </div>
  );
}
