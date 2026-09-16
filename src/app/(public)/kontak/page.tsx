"use client";

import * as React from "react";
import {
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function KontakPage() {
  const [nama, setNama] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [wa, setWa] = React.useState("");
  const [kendala, setKendala] = React.useState("Top-Up Belum Masuk");
  const [pesan, setPesan] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !pesan) {
      toast.error("Harap lengkapi semua kolom yang bertanda bintang.");
      return;
    }
    toast.success("Pesan Anda berhasil dikirim! Tim CS kami akan merespons via WhatsApp / Email dalam 10 menit.");
    setNama("");
    setEmail("");
    setWa("");
    setPesan("");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 max-w-5xl">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="gaming" className="font-bold">
          PUSAT BANTUAN &amp; LAYANAN PELANGGAN
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Ada Kendala Transaksi? Kami Siap Membantu!
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Tim Customer Support kami bersiaga 24 jam sehari, 7 hari seminggu untuk menjawab pertanyaan atau mempercepat verifikasi pesanan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Box */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-2xl border-border p-6 space-y-6 bg-card">
            <h3 className="font-heading font-bold text-lg">
              Kontak Resmi TopUpGame
            </h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors"
              >
                <MessageSquare className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">WhatsApp CS (Prioritas)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    +62 812-3456-7890 (Respon &lt; 5 menit)
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-muted/50">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Email Bantuan</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    support@topupgame.id
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-muted/50">
                <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Jam Operasional</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Senin – Minggu: 24 Jam Non-Stop
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-muted/50">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Kantor Operasional</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Menara Cyber 2, Lt. 18, Jl. H.R. Rasuna Said, Kuningan Timur, Jakarta Selatan 12950
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl border-border bg-card p-6 shadow-sm">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-lg">Kirim Pesan / Pengaduan</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    placeholder="Contoh: Rizky Aditya"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Alamat Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="wa">Nomor WhatsApp Aktif</Label>
                  <Input
                    id="wa"
                    placeholder="081234567890"
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="kendala">Kategori Kendala</Label>
                  <select
                    id="kendala"
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={kendala}
                    onChange={(e) => setKendala(e.target.value)}
                  >
                    <option value="Top-Up Belum Masuk">Top-Up Belum Masuk</option>
                    <option value="Verifikasi Transfer Manual">Verifikasi Transfer Manual</option>
                    <option value="Layanan Joki Rank">Layanan Joki Rank</option>
                    <option value="Masalah Akun / Refund">Masalah Akun / Refund</option>
                    <option value="Kemitraan Joki / Supplier">Kemitraan Joki / Supplier</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pesan">Detail Pesan / Nomor Invoice *</Label>
                <Textarea
                  id="pesan"
                  placeholder="Sertakan nomor Invoice ID (misal: TUG-2025-000431) dan User ID game Anda untuk mempercepat penanganan..."
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" size="lg" className="w-full shadow-glow">
                <Send className="h-4 w-4 mr-2" />
                Kirim Pengaduan Sekarang
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
