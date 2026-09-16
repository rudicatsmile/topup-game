import Link from "next/link";
import {
  Gamepad2,
  ShieldCheck,
  Zap,
  Headphones,
  CreditCard,
  Instagram,
  Youtube,
  MessageSquare,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card/60 text-card-foreground">
      {/* Value Proposition Strip */}
      <div className="border-b border-border/60 py-8 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Proses Kilat &lt; 60 Detik</h4>
              <p className="text-xs text-muted-foreground">
                Sistem otomatis kirim diamond langsung ke akun Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">100% Legal & Bergaransi</h4>
              <p className="text-xs text-muted-foreground">
                Sumber resmi tanpa resiko minus atau banned akun.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Pembayaran Lengkap</h4>
              <p className="text-xs text-muted-foreground">
                QRIS, Bank BCA, Mandiri, BRI, DANA, OVO & GoPay.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Layanan CS 24/7 Ramah</h4>
              <p className="text-xs text-muted-foreground">
                Siap membantu kendala transaksi via WhatsApp kapan pun.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Description */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-glow">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="font-heading text-xl font-extrabold tracking-tight">
              TopUp<span className="text-primary">Game</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            TopUpGame adalah platform top-up voucher game digital dan layanan joki rank terpercaya nomor satu di Indonesia. Kami memberikan kemudahan, keamanan enkripsi, dan harga terbaik untuk para gamer sejati.
          </p>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground font-medium mb-2">
              Layanan Pelanggan Resmi WhatsApp:
            </p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              +62 812-3456-7890 (Fast Response)
            </a>
          </div>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-3">Layanan Kami</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/top-up/mobile-legends" className="hover:text-primary transition-colors">
                Top Up Mobile Legends
              </Link>
            </li>
            <li>
              <Link href="/top-up/free-fire" className="hover:text-primary transition-colors">
                Top Up Free Fire
              </Link>
            </li>
            <li>
              <Link href="/top-up/valorant" className="hover:text-primary transition-colors">
                Top Up Valorant Points
              </Link>
            </li>
            <li>
              <Link href="/joki" className="hover:text-primary transition-colors">
                Joki Rank Mobile Legends
              </Link>
            </li>
            <li>
              <Link href="/promo" className="hover:text-primary transition-colors">
                Klaim Voucher Diskon
              </Link>
            </li>
          </ul>
        </div>

        {/* Bantuan & Navigasi */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-3">Pusat Bantuan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/lacak" className="hover:text-primary transition-colors">
                Lacak Status Pesanan
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-primary transition-colors">
                Pertanyaan Umum (FAQ)
              </Link>
            </li>
            <li>
              <Link href="/kontak" className="hover:text-primary transition-colors">
                Hubungi Kami
              </Link>
            </li>
            <li>
              <Link href="/tentang" className="hover:text-primary transition-colors">
                Tentang TopUpGame
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary transition-colors">
                Artikel & Meta Game
              </Link>
            </li>
          </ul>
        </div>

        {/* Legalitas & Kebijakan */}
        <div>
          <h4 className="font-heading font-bold text-sm mb-3">Legal & Kebijakan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/syarat-ketentuan" className="hover:text-primary transition-colors">
                Syarat & Ketentuan
              </Link>
            </li>
            <li>
              <Link href="/kebijakan-privasi" className="hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-primary transition-colors">
                Kebijakan Refund
              </Link>
            </li>
            <li className="pt-2">
              <span className="text-xs font-semibold text-foreground block mb-1">
                Ikuti Komunitas Kami:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Payment Methods */}
      <div className="border-t border-border py-6 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © 2025 PT TopUpGame Indonesia. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span>Metode Bayar:</span>
            <span className="px-2 py-0.5 rounded bg-muted">QRIS</span>
            <span className="px-2 py-0.5 rounded bg-muted">BCA</span>
            <span className="px-2 py-0.5 rounded bg-muted">Mandiri</span>
            <span className="px-2 py-0.5 rounded bg-muted">DANA</span>
            <span className="px-2 py-0.5 rounded bg-muted">GoPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
