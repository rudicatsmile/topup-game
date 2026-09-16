"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Ticket,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DUMMY_GAMES,
  DUMMY_PRODUCTS,
  DUMMY_PAYMENT_METHODS,
  DUMMY_VOUCHERS,
} from "@/lib/dummy-data";
import { formatRupiah, cn } from "@/lib/utils";
import { toast } from "sonner";
import { createOrderTopup } from "@/actions/orders";

export default function GameTopUpDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const game = DUMMY_GAMES.find((g) => g.slug === slug) || DUMMY_GAMES[0];
  const products = DUMMY_PRODUCTS.filter(
    (p) => p.gameSlug === game.slug || p.gameId === game.id
  );
  const displayProducts =
    products.length > 0
      ? products
      : DUMMY_PRODUCTS.slice(0, 6).map((p) => ({
          ...p,
          gameId: game.id,
          gameSlug: game.slug,
        }));

  // Form states
  const [userId, setUserId] = React.useState("");
  const [zoneId, setZoneId] = React.useState("");
  const [checkedNickname, setCheckedNickname] = React.useState<string | null>(
    null
  );
  const [selectedProductId, setSelectedProductId] = React.useState<string>(
    displayProducts[0]?.id || ""
  );
  const [selectedPaymentCode, setSelectedPaymentCode] =
    React.useState<string>("XENDIT_QRIS");
  const [phoneWa, setPhoneWa] = React.useState("081234567890");
  const [voucherCode, setVoucherCode] = React.useState("");
  const [appliedVoucher, setAppliedVoucher] = React.useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [checkoutModalOpen, setCheckoutModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedProduct =
    displayProducts.find((p) => p.id === selectedProductId) ||
    displayProducts[0];
  const selectedPayment =
    DUMMY_PAYMENT_METHODS.find((pm) => pm.code === selectedPaymentCode) ||
    DUMMY_PAYMENT_METHODS[0];

  const subtotal = selectedProduct ? selectedProduct.priceSell : 0;
  const paymentFee = selectedPayment ? selectedPayment.fee : 0;
  const total = Math.max(0, subtotal - discountAmount + paymentFee);

  // Check Nickname Handler
  const handleCheckNickname = () => {
    if (!userId.trim()) {
      toast.error("Silakan masukkan User ID terlebih dahulu.");
      return;
    }
    setCheckedNickname("RizkySlayer (Verified)");
    toast.success("Akun terverifikasi: RizkySlayer");
  };

  // Apply Voucher Handler
  const handleApplyVoucher = () => {
    const v = DUMMY_VOUCHERS.find(
      (item) => item.code.toUpperCase() === voucherCode.trim().toUpperCase()
    );
    if (!v) {
      toast.error("Kode voucher tidak ditemukan atau sudah kadaluarsa.");
      return;
    }
    const discount =
      v.type === "PERCENT"
        ? Math.min((subtotal * v.value) / 100, v.maxDiscount || 999999)
        : v.value;
    setDiscountAmount(discount);
    setAppliedVoucher(v.code);
    toast.success(`Voucher ${v.code} berhasil diterapkan! Hemat ${formatRupiah(discount)}`);
  };

  // Confirm Checkout Handler
  const handleProceedPayment = () => {
    if (!userId.trim()) {
      toast.error("Harap isi User ID game Anda.");
      return;
    }
    setCheckoutModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/top-up" className="hover:text-foreground">
          Top-Up
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">{game.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Game Info & Steps */}
        <div className="lg:col-span-8 space-y-8">
          {/* Game Banner Header */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="relative h-44 sm:h-52 w-full bg-muted">
              <img
                src={game.bannerUrl}
                alt={game.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
            <div className="p-6 -mt-16 relative z-10 flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="h-24 w-24 rounded-2xl overflow-hidden border-4 border-card shadow-lg bg-muted shrink-0">
                <img
                  src={game.logoUrl}
                  alt={game.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="gaming" className="font-bold">
                    {game.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {game.publisher}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading mt-1">
                  {game.name}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Pengiriman instan otomatis &bull; Layanan 24 Jam Nonstop
                </p>
              </div>
            </div>
          </div>

          {/* STEP 1: Input ID Akun */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow">
                  1
                </div>
                <div>
                  <CardTitle className="text-base">Masukkan Data Akun</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pastikan User ID dan Zone ID diisi dengan benar
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="userId">User ID Game *</Label>
                  <Input
                    id="userId"
                    placeholder="Contoh: 84729104"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                {game.needsZoneId && (
                  <div className="space-y-1.5">
                    <Label htmlFor="zoneId">Zone ID / Server *</Label>
                    <Input
                      id="zoneId"
                      placeholder="Contoh: 2104"
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCheckNickname}
                  className="text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-accent" />
                  Cek Nickname Otomatis
                </Button>

                {checkedNickname && (
                  <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    Nickname: {checkedNickname}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Untuk menemukan ID Anda, klik avatar profil di dalam game pada pojok kiri atas layar utama.
              </p>
            </CardContent>
          </Card>

          {/* STEP 2: Pilih Nominal Produk */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow">
                  2
                </div>
                <div>
                  <CardTitle className="text-base">Pilih Nominal Diamond / Paket</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pilih paket item yang ingin kamu beli
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayProducts.map((product) => {
                  const isSelected = selectedProductId === product.id;
                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={cn(
                        "relative flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 text-left",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-glow ring-1 ring-primary"
                          : "border-border bg-card hover:border-border/80 hover:bg-muted/40"
                      )}
                    >
                      {product.discountPercent && (
                        <span className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground px-2 py-0.2 text-[9px] font-bold shadow">
                          HEMAT {product.discountPercent}%
                        </span>
                      )}
                      <div>
                        <span className="font-heading font-bold text-xs sm:text-sm block leading-snug">
                          {product.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          Stok: {product.stock > 0 ? "Tersedia" : "Habis"}
                        </span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <span className="font-price font-bold text-sm text-accent">
                          {formatRupiah(product.priceSell)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* STEP 3: Pilih Metode Pembayaran */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow">
                  3
                </div>
                <div>
                  <CardTitle className="text-base">Pilih Metode Pembayaran</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tersedia pembayaran otomatis &amp; bebas biaya admin
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DUMMY_PAYMENT_METHODS.map((pm) => {
                  const isSelected = selectedPaymentCode === pm.code;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setSelectedPaymentCode(pm.code)}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
                        isSelected
                          ? "border-accent bg-accent/10 shadow-glow-accent ring-1 ring-accent"
                          : "border-border bg-card hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm">
                              {pm.name}
                            </span>
                            {pm.badge && (
                              <span className="rounded bg-accent/20 px-1.5 py-0.2 text-[9px] font-bold text-accent">
                                {pm.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-muted-foreground block">
                            Biaya Admin: {pm.fee === 0 ? "GRATIS" : formatRupiah(pm.fee)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* STEP 4: Kontak & Voucher */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow">
                  4
                </div>
                <div>
                  <CardTitle className="text-base">Nomor WhatsApp &amp; Kupon Promo</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Bukti transaksi &amp; status pengiriman akan dikirim via WhatsApp
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phoneWa">Nomor WhatsApp Aktif *</Label>
                <Input
                  id="phoneWa"
                  placeholder="Contoh: 081234567890"
                  value={phoneWa}
                  onChange={(e) => setPhoneWa(e.target.value)}
                />
              </div>

              {/* Voucher Box */}
              <div className="space-y-1.5">
                <Label htmlFor="voucher">Punya Kode Promo / Voucher?</Label>
                <div className="flex gap-2">
                  <Input
                    id="voucher"
                    placeholder="Contoh: HEMAT20"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="uppercase"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleApplyVoucher}
                  >
                    Gunakan
                  </Button>
                </div>
                {appliedVoucher && (
                  <p className="text-xs text-emerald-500 font-semibold mt-1">
                    ✓ Kupon {appliedVoucher} aktif (-{formatRupiah(discountAmount)})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sticky Checkout Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 space-y-4">
            <Card className="rounded-2xl border-border bg-card shadow-lg">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Ringkasan Pesanan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4 text-sm">
                <div className="space-y-2 pb-4 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Game:</span>
                    <span className="font-bold">{game.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item:</span>
                    <span className="font-semibold text-right">
                      {selectedProduct?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono font-bold">
                      {userId || "-"} {zoneId ? `(${zoneId})` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metode Bayar:</span>
                    <span className="font-semibold">{selectedPayment?.name}</span>
                  </div>
                </div>

                <div className="space-y-2 pb-4 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga Item:</span>
                    <span className="font-price font-semibold">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>Diskon Voucher:</span>
                      <span className="font-price">
                        -{formatRupiah(discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Layanan:</span>
                    <span className="font-price">
                      {paymentFee === 0 ? "Gratis" : formatRupiah(paymentFee)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-base">Total Bayar:</span>
                  <span className="font-price font-extrabold text-2xl text-accent">
                    {formatRupiah(total)}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full h-12 text-base font-bold shadow-glow"
                  onClick={handleProceedPayment}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Bayar Sekarang
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Transaksi Aman &amp; Terenkripsi SSL 256-Bit</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Mockup Dialog */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
            <DialogDescription>
              Silakan periksa detail pesanan Anda sebelum melanjutkan proses pembayaran.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 text-sm">
            <div className="p-3 rounded-xl bg-muted/60 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Invoice ID:</span>
                <span className="font-mono font-bold text-primary">
                  TUG-2025-000431
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tujuan:</span>
                <span className="font-bold">
                  {userId} {zoneId ? `(${zoneId})` : ""}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Nominal:</span>
                <span className="font-semibold">{selectedProduct?.label}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-border">
                <span className="font-bold">Total Pembayaran:</span>
                <span className="font-price font-bold text-accent text-base">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Setelah menekan "Lanjut Bayar", Anda akan diarahkan ke instruksi pembayaran {selectedPayment?.name}.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setCheckoutModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="shadow-glow"
              disabled={isSubmitting}
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  const res = await createOrderTopup({
                    gameId: game.id,
                    productId: selectedProduct?.id || "prod-1",
                    gameUserId: userId,
                    gameZoneId: zoneId || undefined,
                    paymentMethod: selectedPaymentCode as any,
                    voucherCode: appliedVoucher || undefined,
                    customerPhone: phoneWa,
                  });

                  setCheckoutModalOpen(false);
                  toast.success(`Pesanan ${res.invoiceId} berhasil dibuat! Mengarahkan ke status pesanan...`);
                  router.push("/dashboard/orders");
                } catch (err: any) {
                  toast.error(err.message || "Gagal membuat pesanan.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? "Membuat Pesanan..." : "Lanjut Bayar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
