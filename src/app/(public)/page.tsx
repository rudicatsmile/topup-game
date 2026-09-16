import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Flame,
  ShieldCheck,
  Headphones,
  CreditCard,
  ChevronRight,
  Sparkles,
  Star,
  Clock,
  ArrowRight,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DUMMY_GAMES,
  DUMMY_PRODUCTS,
  DUMMY_TESTIMONIALS,
  DUMMY_VOUCHERS,
} from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";

export default function HomePage() {
  const flashSaleItems = DUMMY_PRODUCTS.filter((p) => p.isPromo).slice(0, 4);
  const popularGames = DUMMY_GAMES.filter((g) => g.popular);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 hero-glow border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5 text-accent animate-spin" />
                <span>Top-Up Otomatis 24 Jam &amp; Joki Rank Termurah di Indonesia</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Beli Diamond Kilat, <br />
                <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
                  Push Rank Tanpa Ragu.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Nikmati proses top-up game instan hitungan detik langsung masuk ke akun Anda. Didukung layanan joki rank profesional bergaransi keamanan akun 100% dan harga paling hemat.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button asChild size="lg" className="h-12 px-7 text-base shadow-glow">
                  <Link href="/top-up">
                    <Zap className="h-5 w-5 mr-2 fill-current" />
                    Mulai Top-Up Sekarang
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base border-primary/40 hover:bg-primary/10">
                  <Link href="/joki">
                    <Flame className="h-5 w-5 mr-2 text-accent" />
                    Layanan Joki Rank
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/60 text-center lg:text-left">
                <div>
                  <h4 className="font-heading font-extrabold text-2xl text-foreground font-price">
                    &lt; 60 dtk
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Rata-rata Proses Kirim
                  </p>
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-2xl text-foreground font-price">
                    100.000+
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Transaksi Berhasil
                  </p>
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-2xl text-foreground font-price flex items-center justify-center lg:justify-start gap-1">
                    4.9<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kepuasan Gamer
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Card / Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl border border-primary/30 bg-card/80 p-6 shadow-2xl backdrop-blur-xl border-glow">
                {/* Header card */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Server Online &amp; Auto-Delivery
                    </span>
                  </div>
                  <Badge variant="accent" className="text-[10px]">
                    PROMO AKTIF
                  </Badge>
                </div>

                {/* Promo Highlight Item */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                      MLBB
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Weekly Diamond Pass</span>
                        <Badge variant="destructive" className="text-[10px]">
                          HEMAT 15%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-accent font-price">
                          {formatRupiah(29500)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through font-price">
                          {formatRupiah(35000)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold">
                      VAL
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">1.375 Valorant Points</span>
                        <span className="text-xs text-muted-foreground">Stok Siap</span>
                      </div>
                      <span className="text-sm font-bold text-accent font-price">
                        {formatRupiah(145000)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Voucher Promo Box */}
                <div className="mt-2 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 p-3.5 border border-primary/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">
                      Gunakan Kode Kupon:
                    </span>
                    <span className="font-mono font-bold text-sm text-primary tracking-wider">
                      HEMAT20
                    </span>
                  </div>
                  <Button asChild size="sm" variant="accent" className="h-8 text-xs font-bold">
                    <Link href="/top-up">Gunakan</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-1">
              <Flame className="h-4 w-4 fill-primary" />
              <span>Flash Sale Terbatas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
              Harga Spesial Hari Ini
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold">
              <Clock className="h-4 w-4" />
              <span>Berakhir dalam: 06:42:15</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {flashSaleItems.map((prod) => (
            <Card
              key={prod.id}
              className="group overflow-hidden rounded-2xl border-border hover:border-primary/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="gaming" className="text-[11px] uppercase font-bold">
                      {prod.gameSlug === "mobile-legends" ? "Mobile Legends" : prod.gameSlug}
                    </Badge>
                    {prod.discountPercent && (
                      <Badge variant="destructive" className="text-[10px] font-bold">
                        -{prod.discountPercent}%
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">
                    {prod.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tersedia {prod.stock} kuota hari ini
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Harga Promo
                    </span>
                    <span className="font-price font-bold text-lg text-accent">
                      {formatRupiah(prod.priceSell)}
                    </span>
                  </div>
                  <Button asChild size="sm" className="rounded-lg shadow-glow">
                    <Link href={`/top-up/${prod.gameSlug}`}>
                      Beli
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Games Catalog Grid */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading">
              Pilih Game Favorit Kamu
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top-up cepat &amp; instan untuk semua judul game terpopuler di Indonesia
            </p>
          </div>
          <Button asChild variant="ghost" className="text-sm font-semibold text-primary">
            <Link href="/top-up" className="flex items-center gap-1">
              <span>Lihat Semua Game</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {DUMMY_GAMES.map((game) => (
            <Link
              key={game.id}
              href={`/top-up/${game.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-3 text-center transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-glow"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted mb-3">
                <img
                  src={game.logoUrl}
                  alt={game.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {game.hasJoki && (
                  <span className="absolute top-2 right-2 rounded-md bg-accent/90 px-1.5 py-0.5 text-[9px] font-bold text-black shadow">
                    JOKI
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {game.name}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {game.publisher}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Joki Rank Banner Showcase */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-accent/30 bg-gradient-to-r from-card via-card to-accent/10 p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <Badge variant="accent" className="font-bold text-xs">
              LAYANAN JOKI RANK PROFESIONAL
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
              Stuck di Epic atau Legend? <br />
              <span className="text-accent">Waktunya Push ke Mythic Glory!</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Dikerjakan oleh Top Global &amp; Pro Player pilihan. Login akun Anda diamankan enkripsi AES-256-GCM, update kenaikan bintang realtime, dan garansi bintang kembali 100% jika kalah.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" variant="accent" className="h-11 px-6 shadow-glow-accent">
                <Link href="/joki">
                  <Flame className="h-4 w-4 mr-2" />
                  Kalkulator Joki Sekarang
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6">
                <Link href="/lacak">
                  Pantau Pesanan Aktif
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Apa Kata Gamer Indonesia?
          </h2>
          <p className="text-sm text-muted-foreground">
            Ulasan asli dari ratusan ribu gamer yang puas bertransaksi di TopUpGame
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DUMMY_TESTIMONIALS.map((t) => (
            <Card key={t.id} className="rounded-2xl border-border bg-card p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                />
                <div>
                  <h4 className="font-bold text-xs">{t.name}</h4>
                  <span className="text-[11px] text-primary font-medium">
                    {t.game} • {t.date}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
