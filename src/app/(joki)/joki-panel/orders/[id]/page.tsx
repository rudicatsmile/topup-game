"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Upload,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DUMMY_JOKI_ORDERS } from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";
import { revealJokiCredentials, updateJokiProgress } from "@/actions/orders";

export default function JokiOrderDetailUpdatePage() {
  const params = useParams();
  const id = params?.id as string;
  const order = DUMMY_JOKI_ORDERS.find((o) => o.id === id) || DUMMY_JOKI_ORDERS[0];

  // States
  const [currentRank, setCurrentRank] = React.useState(order.currentTierName);
  const [progressPercent, setProgressPercent] = React.useState(order.progressPercent);
  const [matchNote, setMatchNote] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [revealedPassword, setRevealedPassword] = React.useState<string | null>(null);
  const [uploadedScreenshot, setUploadedScreenshot] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleRevealPassword = async () => {
    if (!showPassword) {
      toast.warning("Akses kredensial sensitif: Mencatat ke tabel audit_logs...");
      try {
        const res = await revealJokiCredentials(order.id);
        if (res.success && res.credentials) {
          setRevealedPassword(res.credentials.password);
          setShowPassword(true);
          toast.success("Kredensial berhasil didekripsi (Audit ID tercatat).");
        }
      } catch {
        setShowPassword(true);
      }
    } else {
      setShowPassword(false);
    }
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateJokiProgress({
        orderJokiId: order.id,
        progressPercent,
        note: matchNote,
      });
      toast.success("Progres joki berhasil diperbarui! Notifikasi telah dikirim ke pembeli.");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui progres.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedScreenshot(file.name);
      toast.success(`Screenshot "${file.name}" berhasil diunggah ke cloud storage.`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/joki-panel/orders" className="flex items-center gap-1.5 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Order
          </Link>
        </Button>
        <span className="font-mono text-xs text-primary font-bold">
          {order.invoiceId}
        </span>
      </div>

      {/* Sensitive Credentials Card */}
      <Card className="rounded-2xl border-amber-500/40 bg-amber-500/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <ShieldAlert className="h-5 w-5" />
            <span>Kredensial Login Akun Pembeli (Terenkripsi AES-256)</span>
          </div>
          <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
            AUDIT LOG ACTIVE
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Gunakan kredensial ini hanya untuk keperluan bertanding push rank. Dilarang keras mengubah password, email, atau mengutak-atik item di dalam akun.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-card border border-border">
            <span className="text-muted-foreground block text-[11px]">
              Email / ID Akun:
            </span>
            <span className="font-mono font-bold text-sm text-foreground">
              {order.accountEmail || "rizky.mlbb@gmail.com"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border flex items-center justify-between">
            <div>
              <span className="text-muted-foreground block text-[11px]">
                Password Game:
              </span>
              <span className="font-mono font-bold text-sm text-foreground">
                {showPassword ? (revealedPassword || "MobileLegendsPro2025!") : "••••••••••••"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRevealPassword}
              className="text-xs h-8"
            >
              {showPassword ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 mr-1" /> Tutup
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 mr-1 text-primary" /> Buka Kunci
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-card border border-border text-xs">
          <span className="text-muted-foreground block text-[11px]">
            Catatan dari Pembeli:
          </span>
          <span className="text-foreground italic">
            "{order.notes || "Fokus hero assassin/mage"}"
          </span>
        </div>
      </Card>

      {/* Form Update Progres */}
      <Card className="rounded-2xl border-border bg-card p-6 space-y-6">
        <CardHeader className="p-0 pb-4 border-b border-border">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="h-4 w-4 text-accent" />
            <span>Formulir Pembaruan Progres Rank</span>
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleUpdateProgress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentRank">Posisi Rank Terbaru *</Label>
              <Input
                id="currentRank"
                value={currentRank}
                onChange={(e) => setCurrentRank(e.target.value)}
                placeholder="Contoh: Legend I (4 Bintang)"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="percent">Persentase Target Tercapai (%): {progressPercent}%</Label>
              <input
                id="percent"
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent mt-2"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="screenshot">Upload Screenshot Bukti Match (JPG/PNG)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleUploadScreenshot}
                className="text-xs max-w-sm"
              />
              {uploadedScreenshot && (
                <span className="text-xs text-emerald-500 font-semibold">
                  ✓ {uploadedScreenshot}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="matchNote">Catatan Hasil Match</Label>
            <Textarea
              id="matchNote"
              placeholder="Contoh: Menang beruntun 4x, MVP Ling 14/1/9. Lanjut 1 match lagi ke Mythic!"
              value={matchNote}
              onChange={(e) => setMatchNote(e.target.value)}
              className="text-xs min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Setiap pembaruan akan otomatis menulis ke audit_logs
            </span>
            <Button type="submit" size="sm" variant="accent" className="shadow-glow-accent">
              Simpan &amp; Notifikasi Pembeli
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
