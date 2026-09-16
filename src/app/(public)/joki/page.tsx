import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  Zap,
  Lock,
  MessageSquare,
  Award,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_GAMES,
  DUMMY_JOKI_WORKERS,
  DUMMY_JOKI_TIERS,
} from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";

export default function JokiLandingPage() {
  const jokiGames = DUMMY_GAMES.filter((g) => g.hasJoki);

  return (
    <div className="space-y-16 py-10">
      {/* Hero Banner */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-accent/40 bg-gradient-to-r from-card via-card to-accent/15 p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-6 relative z-10">
            <Badge variant="accent" className="font-bold text-xs">
              LAYANAN JOKI RANK RESMI &amp; TERPERCAYA
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-[1.15]">
              Naik Rank Kilat, <br />
              <span className="text-accent">Dikerjakan Top Global Pro.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Tingkatkan tier rank Anda tanpa ribet dan frustrasi solo queue. Didukung enkripsi kredensial login standar perbankan AES-256-GCM, live progress bar, dan obrolan langsung dengan worker joki.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" variant="accent" className="h-12 px-7 text-base shadow-glow-accent">
                <Link href="/joki/mobile-legends">
                  <Flame className="h-5 w-5 mr-2" />
                  Order Joki Mobile Legends
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base">
                <Link href="/lacak">
                  Lacak Progres Joki Saya
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Keunggulan Utama */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Kenapa Memilih Joki di TopUpGame?
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Standar profesional pertama di Indonesia dengan transparansi penuh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-2xl border-border p-6 space-y-3">
            <div className="h-12 w-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base">Login Terenkripsi AES-256</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Data login akun game Anda dienkripsi berlapis. Hanya joki bertugas yang dapat mengakses akun Anda.
            </p>
          </Card>

          <Card className="rounded-2xl border-border p-6 space-y-3">
            <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base">Worker Pro Terverifikasi</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Joki kami adalah Top Global dengan Win Rate di atas 80% dan melewati seleksi verifikasi ketat.
            </p>
          </Card>

          <Card className="rounded-2xl border-border p-6 space-y-3">
            <div className="h-12 w-12 rounded-xl bg-success/20 text-success flex items-center justify-center">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base">Live Chat &amp; Screenshot Bukti</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pantau progres bintang realtime, minta hero khusus, dan terima bukti screenshot kemenangan setiap match.
            </p>
          </Card>

          <Card className="rounded-2xl border-border p-6 space-y-3">
            <div className="h-12 w-12 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base">Garansi 100% Aman</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dilarang keras menggunakan cheat/script. Jika ada bintang yang turun, kami ganti gratis sampai target tercapai.
            </p>
          </Card>
        </div>
      </section>

      {/* Pilih Game untuk Joki */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
              Game yang Tersedia untuk Joki
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih game dan langsung hitung estimasi harga dan durasi pengerjaan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jokiGames.map((game) => (
            <Card
              key={game.id}
              className="group overflow-hidden rounded-2xl border-border hover:border-accent/60 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-glow-accent"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={game.bannerUrl}
                  alt={game.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge variant="accent" className="absolute top-3 right-3 font-bold">
                  TERSEDIA
                </Badge>
              </div>
              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-base font-heading">
                    {game.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mulai dari {formatRupiah(6000)} / bintang
                  </p>
                </div>

                <Button asChild className="w-full" variant="outline">
                  <Link href={`/joki/${game.slug}`}>
                    Buka Kalkulator Order
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Worker Pro Showcase */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Mitra Joki Terbaik Kami
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Top Global berpengalaman dengan rating kepuasan pelanggan tertinggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DUMMY_JOKI_WORKERS.map((worker) => (
            <Card key={worker.id} className="rounded-2xl border-border p-6 flex items-center gap-4">
              <img
                src={worker.avatarUrl}
                alt={worker.displayName}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-accent shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm truncate">
                    {worker.displayName}
                  </h4>
                  <Badge variant={worker.isOnline ? "success" : "outline"} className="text-[9px]">
                    {worker.isOnline ? "ONLINE" : "OFFLINE"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-1">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{worker.ratingAvg} / 5.0</span>
                  <span className="text-muted-foreground font-normal">
                    ({worker.ratingCount} ulasan)
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 truncate">
                  Spesialis: {worker.skillGames.join(", ")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
