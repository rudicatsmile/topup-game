"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = React.useState("gamer.sultan@gmail.com");
  const [password, setPassword] = React.useState("Password123!");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Gagal masuk. Periksa email & kata sandi Anda.");
        setIsLoading(false);
        return;
      }

      toast.success(`Login berhasil! Selamat datang, ${data.user.name}`);

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (data.user.role === "admin" || data.user.role === "super_admin") {
        router.push("/admin");
      } else if (data.user.role === "joki") {
        router.push("/joki-panel");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      toast.error("Terjadi kendala jaringan saat menghubungi server autentikasi.");
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
          Masuk ke TopUpGame
        </CardTitle>
        <CardDescription className="text-xs">
          Akses dashboard transaksi top-up diamond dan layanan joki rank kamu
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Alamat Email</Label>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Kata Sandi</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? "Memproses Masuk..." : "Masuk Sekarang"}
            {!isLoading && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>

          {/* Demo Roles Shortcut for quick testing */}
          <div className="pt-2 text-center">
            <span className="text-[11px] text-muted-foreground block mb-2">
              Shortcut Demo Akun:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setEmail("gamer.sultan@gmail.com");
                  setPassword("Password123!");
                  toast.info("Preset Member dimuat");
                }}
                className="p-1.5 rounded bg-muted hover:bg-muted/80 font-semibold text-foreground"
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("worker.budi@topupgame.id");
                  setPassword("Password123!");
                  toast.info("Preset Joki dimuat");
                }}
                className="p-1.5 rounded bg-muted hover:bg-muted/80 font-semibold text-accent"
              >
                Joki
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("owner@topupgame.id");
                  setPassword("Password123!");
                  toast.info("Preset Admin dimuat");
                }}
                className="p-1.5 rounded bg-primary/20 hover:bg-primary/30 font-bold text-primary"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-border text-xs text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Daftar Akun Baru
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <React.Suspense fallback={<div className="text-sm text-muted-foreground">Memuat halaman login...</div>}>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}
