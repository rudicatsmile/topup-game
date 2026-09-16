"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "demo-token";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Gagal memperbarui kata sandi.");
        setIsLoading(false);
        return;
      }

      toast.success(data.message || "Kata sandi berhasil diperbarui!");
      router.push("/login");
    } catch {
      toast.error("Terjadi kendala jaringan saat mengatur ulang sandi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md rounded-3xl border-border bg-card p-4 sm:p-6 shadow-2xl">
      <CardHeader className="text-center space-y-2 pb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white mx-auto shadow-glow">
          <Gamepad2 className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading">
          Atur Kata Sandi Baru
        </CardTitle>
        <CardDescription className="text-xs">
          Masukkan kata sandi baru yang kuat untuk mengamankan akun Anda.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Kata Sandi Baru</Label>
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
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-11 rounded-xl"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-11 font-bold shadow-glow mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Menyimpan..." : "Simpan Kata Sandi"}
            {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>

          <div className="text-center pt-4 border-t border-border text-xs text-muted-foreground">
            <Link href="/login" className="font-bold text-primary hover:underline">
              Batal dan Kembali ke Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <React.Suspense fallback={<div className="text-sm text-muted-foreground">Memuat halaman reset password...</div>}>
        <ResetPasswordForm />
      </React.Suspense>
    </div>
  );
}
