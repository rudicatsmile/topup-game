"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  Lock,
  Clock,
  ChevronRight,
  User,
  Star,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_GAMES,
  DUMMY_JOKI_TIERS,
  DUMMY_JOKI_WORKERS,
  DUMMY_PAYMENT_METHODS,
} from "@/lib/dummy-data";
import { formatRupiah, cn } from "@/lib/utils";
import { toast } from "sonner";
import { createOrderJoki } from "@/actions/orders";

export default function GameJokiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const game = DUMMY_GAMES.find((g) => g.slug === slug) || DUMMY_GAMES[0];
  const tiers = DUMMY_JOKI_TIERS;

  // Form states
  const [startTierIndex, setStartTierIndex] = React.useState<number>(1);
  const [targetTierIndex, setTargetTierIndex] = React.useState<number>(3);
  const [selectedWorkerId, setSelectedWorkerId] = React.useState<string>("auto");
  const [accountEmail, setAccountEmail] = React.useState("");
  const [accountPassword, setAccountPassword] = React.useState("");
  const [backupCode, setBackupCode] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [phoneWa, setPhoneWa] = React.useState("081234567890");
  const [selectedPaymentCode, setSelectedPaymentCode] =
    React.useState("XENDIT_QRIS");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Price & Duration Calculation
  const isTargetValid = targetTierIndex > startTierIndex;

  let estimatedPrice = 0;
  let estimatedMinutes = 0;

  if (isTargetValid) {
    for (let i = startTierIndex; i <= targetTierIndex; i++) {
      const tier = tiers[i];
      if (tier) {
        estimatedPrice += tier.pricePerTier * 5; // tier per paket
        estimatedMinutes += tier.estimatedMinutes * 5;
      }
    }
  } else {
    estimatedPrice = 85000;
    estimatedMinutes = 360;
  }

  const estimatedHours = Math.ceil(estimatedMinutes / 60);
  const selectedPayment =
    DUMMY_PAYMENT_METHODS.find((pm) => pm.code === selectedPaymentCode) ||
    DUMMY_PAYMENT_METHODS[0];
  const total = estimatedPrice + (selectedPayment?.fee || 0);

  const handleCheckoutJoki = async () => {
    if (!isTargetValid) {
      toast.error("Rank tujuan harus lebih tinggi dari rank awal!");
      return;
    }
    if (!accountEmail.trim() || !accountPassword.trim()) {
      toast.error("Silakan isi data login akun game Anda.");
      return;
    }

    setIsSubmitting(true);
    try {
      const startTier = tiers[startTierIndex] || tiers[0];
      const targetTier = tiers[targetTierIndex] || tiers[tiers.length - 1];

      const res = await createOrderJoki({
        gameId: game.id,
        startTierId: startTier.id,
        targetTierId: targetTier.id,
        startOrderIndex: startTier.orderIndex,
        targetOrderIndex: targetTier.orderIndex,
        workerId: selectedWorkerId !== "auto" ? selectedWorkerId : undefined,
        gameAccountUsername: accountEmail,
        gameAccountPassword: accountPassword,
        gameLoginVia: "Moonton",
        backupCode: backupCode || undefined,
        notes: notes || undefined,
        paymentMethod: selectedPaymentCode as any,
        customerPhone: phoneWa,
      });

      toast.success(`Order joki ${res.invoiceId} berhasil dibuat! Mengarahkan ke status pesanan...`);
      router.push("/dashboard/joki");
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat pesanan joki.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/joki" className="hover:text-foreground">
          Layanan Joki
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold">{game.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configurator Steps */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Banner */}
          <div className="rounded-3xl border border-border bg-card p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-muted shrink-0">
              <img
                src={game.logoUrl}
                alt={game.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="accent" className="font-bold text-xs">
                  ORDER JOKI RANK
                </Badge>
                <span className="text-xs text-muted-foreground">{game.publisher}</span>
              </div>
              <h1 className="text-2xl font-bold font-heading mt-1">
                Kalkulator Joki Rank {game.name}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hitung perkiraan durasi &amp; harga secara transparan dan instan.
              </p>
            </div>
          </div>

          {/* STEP 1: Pilih Rank Awal & Rank Tujuan */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-glow-accent">
                  1
                </div>
                <div>
                  <CardTitle className="text-base">Pilih Tier Rank</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tentukan posisi rank saat ini dan target yang ingin kamu capai
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Rank Awal */}
                <div className="space-y-2">
                  <Label>Rank Saat Ini (Awal)</Label>
                  <select
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={startTierIndex}
                    onChange={(e) => setStartTierIndex(Number(e.target.value))}
                  >
                    {tiers.map((t, idx) => (
                      <option key={t.id} value={idx}>
                        {t.tierName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rank Tujuan */}
                <div className="space-y-2">
                  <Label>Target Rank Tujuan</Label>
                  <select
                    className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={targetTierIndex}
                    onChange={(e) => setTargetTierIndex(Number(e.target.value))}
                  >
                    {tiers.map((t, idx) => (
                      <option key={t.id} value={idx}>
                        {t.tierName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!isTargetValid && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-xs text-destructive font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    Rank tujuan harus lebih tinggi daripada rank saat ini.
                  </span>
                </div>
              )}

              {/* Estimation Bar */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Estimasi Durasi
                    </span>
                    <span className="font-bold text-sm">
                      ~ {estimatedHours} Jam Kerja
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Estimasi Biaya
                    </span>
                    <span className="font-bold text-sm text-accent font-price">
                      {formatRupiah(estimatedPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: Pilih Joki Worker */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-glow-accent">
                  2
                </div>
                <div>
                  <CardTitle className="text-base">Pilih Worker Joki</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Gunakan rekomendasi auto-assign sistem atau pilih pro player favoritmu
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              {/* Auto Assign Option */}
              <div
                onClick={() => setSelectedWorkerId("auto")}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all",
                  selectedWorkerId === "auto"
                    ? "border-accent bg-accent/10 ring-1 ring-accent"
                    : "border-border hover:bg-muted/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-bold">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">
                      Auto-Assign (Rekomendasi Sistem)
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Ditugaskan ke joki yang sedang online dan beban order terendah
                    </span>
                  </div>
                </div>
                <Badge variant="accent" className="text-[10px]">
                  TERCEPAT
                </Badge>
              </div>

              {/* Workers List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {DUMMY_JOKI_WORKERS.map((worker) => {
                  const isSelected = selectedWorkerId === worker.id;
                  return (
                    <div
                      key={worker.id}
                      onClick={() => setSelectedWorkerId(worker.id)}
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer text-left transition-all",
                        isSelected
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={worker.avatarUrl}
                          alt={worker.displayName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs block truncate">
                            {worker.displayName}
                          </span>
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-current" />
                            {worker.ratingAvg}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        Order aktif: {worker.activeOrders}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* STEP 3: Kredensial Login Akun (Enkripsi Visual) */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-glow-accent">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-base">Data Login Akun Game</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Diperlukan agar joki dapat masuk dan memainkan rank Anda
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-bold">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Enkripsi AES-256-GCM</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="accountEmail">Email / Moonton / Akun Game *</Label>
                  <Input
                    id="accountEmail"
                    placeholder="nama@email.com atau ID Login"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountPassword">Password Akun Game *</Label>
                  <Input
                    id="accountPassword"
                    type="password"
                    placeholder="••••••••"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="backupCode">
                  Kode Cadangan 2FA / Catatan Login (Opsional)
                </Label>
                <Input
                  id="backupCode"
                  placeholder="Contoh: Kode cadangan Google Auth atau instruksi verifikasi WA"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Catatan Khusus untuk Joki (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Contoh: Tolong mainkan hero Assassin (Fanny / Ling), jangan gunakan hero Tank."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-20"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-primary inline mr-1" />
                <strong>Jaminan Keamanan:</strong> Kredensial akun Anda disimpan dalam bentuk terenkripsi penuh. Worker dilarang keras mengubah profil, membuka chat game pribadi, atau menggunakan diamond/tiket Anda.
              </div>
            </CardContent>
          </Card>

          {/* STEP 4: Pembayaran */}
          <Card className="rounded-2xl border-border">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-sm shadow-glow-accent">
                  4
                </div>
                <div>
                  <CardTitle className="text-base">Metode Pembayaran</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pilih metode bayar untuk menyelesaikan pesanan joki
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DUMMY_PAYMENT_METHODS.slice(0, 4).map((pm) => {
                  const isSelected = selectedPaymentCode === pm.code;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setSelectedPaymentCode(pm.code)}
                      className={cn(
                        "flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all",
                        isSelected
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-muted text-primary flex items-center justify-center">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm block">
                            {pm.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
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
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 space-y-4">
            <Card className="rounded-2xl border-border bg-card shadow-lg">
              <CardHeader className="pb-4 border-b border-border">
                <CardTitle className="text-base flex items-center gap-2">
                  <Flame className="h-4 w-4 text-accent" />
                  <span>Rincian Order Joki</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4 text-sm">
                <div className="space-y-2 pb-4 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Game:</span>
                    <span className="font-bold">{game.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rank Asal:</span>
                    <span className="font-semibold">
                      {tiers[startTierIndex]?.tierName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Rank:</span>
                    <span className="font-bold text-accent">
                      {tiers[targetTierIndex]?.tierName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Worker Joki:</span>
                    <span className="font-semibold">
                      {selectedWorkerId === "auto"
                        ? "Auto-Assign Pro"
                        : DUMMY_JOKI_WORKERS.find((w) => w.id === selectedWorkerId)
                            ?.displayName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimasi Waktu:</span>
                    <span className="font-semibold text-emerald-500">
                      ~ {estimatedHours} Jam Pengerjaan
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pb-4 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Joki:</span>
                    <span className="font-price font-semibold">
                      {formatRupiah(estimatedPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Layanan:</span>
                    <span className="font-price">
                      {formatRupiah(selectedPayment?.fee || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-base">Total Biaya:</span>
                  <span className="font-price font-extrabold text-2xl text-accent">
                    {formatRupiah(total)}
                  </span>
                </div>

                <Button
                  size="lg"
                  variant="accent"
                  className="w-full h-12 text-base font-bold shadow-glow-accent"
                  onClick={handleCheckoutJoki}
                >
                  <Flame className="h-5 w-5 mr-2" />
                  Order Joki Sekarang
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Garansi 100% Anti-Minus &amp; Akun Aman</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
