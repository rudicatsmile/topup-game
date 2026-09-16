"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gamepad2, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneWa, setPhoneWa] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreeTerms, setAgreeTerms] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phoneWa || !password) {
      toast.error("Semua kolom wajib diisi.");
      return;
    }
    if (password.length < 8) {
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (!agreeTerms) {
      toast.error("Anda harus menyetujui Syarat & Ketentuan kami.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phoneWa, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Gagal mendaftarkan akun.");
        setIsLoading(false);
        return;
      }

      toast.success("Pendaftaran berhasil! Selamat datang di TopUpGame.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Terjadi kendala jaringan saat mendaftarkan akun.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg rounded-3xl border-border bg-card p-4 sm:p-6 shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white mx-auto shadow-glow">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">
            Daftar Akun TopUpGame
          </CardTitle>
          <CardDescription className="text-xs">
            Dapatkan diskon pengguna baru dan kumpulkan poin reward di setiap transaksi
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Contoh: Rizky Aditya Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Alamat Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phoneWa">Nomor WhatsApp (+62) *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneWa"
                    placeholder="081234567890"
                    value={phoneWa}
                    onChange={(e) => setPhoneWa(e.target.value)}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Kata Sandi *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Konfirmasi Sandi *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-border accent-primary h-4 w-4"
              />
              <label htmlFor="terms" className="text-muted-foreground cursor-pointer">
                Saya menyetujui{" "}
                <Link href="/syarat-ketentuan" className="text-primary hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/kebijakan-privasi" className="text-primary hover:underline">
                  Kebijakan Privasi
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-11 font-bold shadow-glow mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Mendaftarkan Akun..." : "Daftar Akun Sekarang"}
              {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>

            <div className="text-center pt-4 border-t border-border text-xs text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Masuk di Sini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
