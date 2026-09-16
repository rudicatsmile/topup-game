"use client";

import * as React from "react";
import { User, Mail, Phone, Lock, Save, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function UserProfilePage() {
  const [name, setName] = React.useState("Rizky Aditya Pratama");
  const [email, setEmail] = React.useState("rizky.aditya@example.com");
  const [phoneWa, setPhoneWa] = React.useState("081234567890");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil akun berhasil diperbarui!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Harap isi kata sandi lama dan kata sandi baru.");
      return;
    }
    toast.success("Kata sandi berhasil diubah!");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading">
          Pengaturan Profil &amp; Keamanan Akun
        </h1>
        <p className="text-xs text-muted-foreground">
          Kelola data diri, nomor WhatsApp untuk notifikasi transaksi, dan kata sandi Anda
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Avatar Card */}
        <Card className="rounded-2xl border-border bg-card p-6 text-center space-y-4 md:col-span-1">
          <div className="h-24 w-24 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl mx-auto ring-4 ring-primary/20 shadow-glow">
            RA
          </div>
          <div>
            <h3 className="font-bold text-base">{name}</h3>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Badge variant="success" className="text-[10px]">
              ✓ Terverifikasi
            </Badge>
            <Badge variant="gaming" className="text-[10px]">
              Gold Member
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground pt-2 border-t border-border">
            Bergabung sejak Maret 2024
          </p>
        </Card>

        {/* Right: Forms */}
        <div className="space-y-6 md:col-span-2">
          {/* Profile Form */}
          <Card className="rounded-2xl border-border bg-card p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Informasi Kontak</CardTitle>
              <CardDescription className="text-xs">
                Nomor WhatsApp dipakai untuk mengirim bukti pembayaran otomatis
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Alamat Email (Akun)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="rounded-xl text-sm bg-muted"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phoneWa">Nomor WhatsApp Aktif</Label>
                  <Input
                    id="phoneWa"
                    value={phoneWa}
                    onChange={(e) => setPhoneWa(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <Button type="submit" size="sm" className="shadow-glow">
                <Save className="h-4 w-4 mr-1.5" />
                Simpan Perubahan
              </Button>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card className="rounded-2xl border-border bg-card p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base">Ubah Kata Sandi</CardTitle>
              <CardDescription className="text-xs">
                Gunakan kombinasi minimal 8 karakter untuk menjaga akun Anda tetap aman
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="curPass">Kata Sandi Saat Ini</Label>
                  <Input
                    id="curPass"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPass">Kata Sandi Baru</Label>
                  <Input
                    id="newPass"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl text-sm"
                  />
                </div>
              </div>

              <Button type="submit" variant="outline" size="sm">
                <Lock className="h-4 w-4 mr-1.5" />
                Perbarui Kata Sandi
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
