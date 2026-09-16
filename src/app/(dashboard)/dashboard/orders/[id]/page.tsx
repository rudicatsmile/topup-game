"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Printer,
  Upload,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Copy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DUMMY_TOPUP_ORDERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function UserOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const order = DUMMY_TOPUP_ORDERS.find((o) => o.id === id) || DUMMY_TOPUP_ORDERS[0];

  const [uploadedFile, setUploadedFile] = React.useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Teks berhasil disalin ke clipboard!");
  };

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      toast.success(`Bukti transfer "${file.name}" berhasil diunggah! Admin akan segera memverifikasi.`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/orders" className="flex items-center gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Riwayat Order
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/invoice/${order.id}`}>
            <Printer className="h-4 w-4 mr-1.5" />
            Cetak Invoice PDF
          </Link>
        </Button>
      </div>

      {/* Main Order Card */}
      <Card className="rounded-2xl border-border bg-card overflow-hidden shadow-md">
        <CardHeader className="p-6 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-muted-foreground block">
              Nomor Pesanan:
            </span>
            <h1 className="text-xl font-mono font-extrabold tracking-wider text-primary">
              {order.invoiceId}
            </h1>
            <span className="text-xs text-muted-foreground">
              Dibuat pada {formatDate(order.createdAt)}
            </span>
          </div>

          <div>
            {order.status === "SUCCESS" ? (
              <Badge variant="success" className="px-3 py-1 text-xs font-bold">
                ✓ PENGIRIMAN SUKSES
              </Badge>
            ) : order.status === "PROCESSING" ? (
              <Badge variant="accent" className="px-3 py-1 text-xs font-bold">
                ⚡ SEDANG DIPROSES
              </Badge>
            ) : (
              <Badge variant="warning" className="px-3 py-1 text-xs font-bold">
                ⏳ MENUNGGU PEMBAYARAN
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Status Stepper */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
              Tahapan Transaksi:
            </span>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-primary" />
                <span className="font-bold text-primary block">1. Checkout</span>
                <span className="text-[10px] text-muted-foreground">Pesanan Dibuat</span>
              </div>
              <div className="space-y-1">
                <div
                  className={`h-2 rounded-full ${
                    order.status !== "PENDING_PAYMENT" ? "bg-primary" : "bg-muted"
                  }`}
                />
                <span
                  className={`font-bold block ${
                    order.status !== "PENDING_PAYMENT" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  2. Pembayaran
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {order.paidAt ? "Terverifikasi" : "Menunggu Bayar"}
                </span>
              </div>
              <div className="space-y-1">
                <div
                  className={`h-2 rounded-full ${
                    order.status === "SUCCESS" ? "bg-emerald-500" : "bg-muted"
                  }`}
                />
                <span
                  className={`font-bold block ${
                    order.status === "SUCCESS" ? "text-emerald-500" : "text-muted-foreground"
                  }`}
                >
                  3. Pengiriman
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {order.status === "SUCCESS" ? "Diamond Terkirim" : "Menunggu"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions if Pending */}
          {order.status === "PENDING_PAYMENT" && (
            <div className="p-5 rounded-2xl bg-warning/10 border border-warning/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-warning font-bold text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Selesaikan Pembayaran Anda Sebelum Batas Waktu</span>
                </div>
                <Badge variant="warning" className="text-[10px]">
                  Batas: 30 Menit
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground block">Metode Pembayaran:</span>
                  <span className="font-bold text-sm text-foreground">
                    {order.paymentMethodLabel || "BCA Virtual Account"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Nomor Virtual Account:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-base text-accent">
                      8271081234567890
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy("8271081234567890")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Upload Bukti Transfer Manual */}
              <div className="pt-3 border-t border-warning/20">
                <Label className="text-xs font-bold block mb-1.5">
                  Upload Bukti Transfer (Khusus Transfer Manual):
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadProof}
                    className="text-xs max-w-xs"
                  />
                  {uploadedFile && (
                    <span className="text-xs text-emerald-500 font-semibold">
                      ✓ File: {uploadedFile}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Rincian Akun Penerima:
              </span>
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Game:</span>
                  <span className="font-bold">{order.gameName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono font-bold">{order.gameUserId}</span>
                </div>
                {order.gameZoneId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zone ID:</span>
                    <span className="font-mono">{order.gameZoneId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nickname:</span>
                  <span className="font-semibold text-primary">
                    {order.gameNickname || "RizkySlayer"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Rincian Pembayaran:
              </span>
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item:</span>
                  <span className="font-bold">{order.productLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga:</span>
                  <span className="font-price font-semibold">
                    {formatRupiah(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Diskon Voucher:</span>
                    <span className="font-price font-semibold">
                      -{formatRupiah(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biaya Layanan:</span>
                  <span className="font-price">
                    {order.fee === 0 ? "Gratis" : formatRupiah(order.fee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
                  <span>Total Bayar:</span>
                  <span className="font-price text-accent text-base">
                    {formatRupiah(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground">
              Ada kendala pengisian diamond pada transaksi ini?
            </span>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20pesanan%20${order.invoiceId}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                Bantuan CS WhatsApp
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
