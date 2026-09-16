"use client";

import * as React from "react";
import Link from "next/link";
import { Gamepad2, Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Silakan masukkan alamat email akun Anda.");
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      setIsSent(true);
      toast.success(data.message || "Tautan pemulihan telah dikirim ke email Anda.");
    } catch {
      toast.error("Terjadi kendala jaringan saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md rounded-3xl border-border bg-card p-4 sm:p-6 shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white mx-auto shadow-glow">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">
            Lupa Kata Sandi
          </CardTitle>
          <CardDescription className="text-xs">
            Masukkan email yang terdaftar untuk menerima tautan pemulihan kata sandi Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSent ? (
            <div className="space-y-4 text-center py-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground space-y-2">
                <p className="font-semibold">
                  Tautan Pemulihan Telah Terkirim!
                </p>
                <p className="text-muted-foreground">
                  Kami telah mengirimkan instruksi ke <strong>{email}</strong>. Tautan berlaku selama 60 menit.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/reset-password">Buka Halaman Reset Sandi</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Alamat Email Terdaftar</Label>
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

              <Button
                type="submit"
                size="lg"
                className="w-full h-11 font-bold shadow-glow mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Mengirim..." : "Kirim Tautan Pemulihan"}
                {!isLoading && <Send className="h-4 w-4 ml-2" />}
              </Button>
            </form>
          )}

          <div className="text-center pt-6 border-t border-border mt-4 text-xs">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
