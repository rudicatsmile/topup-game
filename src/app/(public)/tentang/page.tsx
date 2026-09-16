import Link from "next/link";
import { Gamepad2, ShieldCheck, Zap, Users, Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TentangPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-16 max-w-5xl">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="gaming" className="font-bold">
          TENTANG TOPUPGAME
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">
          Platform Game Pilihan <br />
          <span className="text-primary">Gamer Sejati Indonesia.</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Didirikan pada tahun 2023, TopUpGame hadir untuk merevolusi ekosistem voucher game dan layanan joki rank agar lebih aman, transparan, dan terjangkau bagi seluruh lapisan masyarakat.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-heading">
            Misi Kami Menghadirkan Pengalaman Gaming Tanpa Hambatan
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Banyak gamer sering mengalami kekecewaan: proses pengisian diamond manual yang memakan waktu berjam-jam, harga yang berubah-ubah, hingga maraknya penipuan berkedok joki rank abal-abal.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            TopUpGame membangun infrastruktur teknologi mutakhir dengan integrasi API supplier otomatis, perlindungan enkripsi AES-256 kredensial akun, serta standardisasi komisi bagi para talenta worker joki lokal di seluruh Nusantara.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Legalitas &amp; Keamanan Terjamin</h4>
              <p className="text-xs text-muted-foreground">
                Beroperasi di bawah PT TopUpGame Indonesia resmi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Server Otomatis 24 Jam</h4>
              <p className="text-xs text-muted-foreground">
                Waktu pemrosesan rata-rata kurang dari 60 detik.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/20 text-success flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">500+ Mitra Joki Terverifikasi</h4>
              <p className="text-xs text-muted-foreground">
                Membantu membuka lapangan kerja bagi atlet esports berbakat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership / Team */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-heading text-center">
          Tim Manajemen &amp; Operasional
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-border p-5 text-center space-y-3">
            <div className="h-20 w-20 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xl mx-auto shadow-glow">
              DK
            </div>
            <div>
              <h4 className="font-bold text-base">Dwi Kartika Sari</h4>
              <p className="text-xs text-primary font-semibold">
                Founder &amp; Chief Executive Officer
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Praktisi industri gaming digital dengan pengalaman 8 tahun di ekosistem esports Indonesia.
            </p>
          </Card>

          <Card className="rounded-2xl border-border p-5 text-center space-y-3">
            <div className="h-20 w-20 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xl mx-auto ring-1 ring-accent">
              BN
            </div>
            <div>
              <h4 className="font-bold text-base">Bagas Nugroho</h4>
              <p className="text-xs text-accent font-semibold">
                Head of Product &amp; Operations
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Memimpin tim teknis, integrasi payment gateway, dan keandalan sistem pengiriman otomatis.
            </p>
          </Card>

          <Card className="rounded-2xl border-border p-5 text-center space-y-3">
            <div className="h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xl mx-auto">
              VM
            </div>
            <div>
              <h4 className="font-bold text-base">Andika "ViperML"</h4>
              <p className="text-xs text-emerald-500 font-semibold">
                Head of Esports &amp; Joki Coordinator
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Mantan pro-player semi-pro yang mengelola standar kualitas kerja dan rating mitra joki.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
