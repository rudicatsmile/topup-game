import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ChevronRight,
  Share2,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_BLOG_POSTS } from "@/lib/dummy-data";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = DUMMY_BLOG_POSTS.find((p) => p.slug === slug) || DUMMY_BLOG_POSTS[0];

  return (
    <article className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/blog" className="hover:text-foreground">
          Blog
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold truncate max-w-xs">
          {post.title}
        </span>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <Badge variant="accent" className="font-bold">
          {post.category}
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-foreground">
              Ditulis oleh {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Bagikan
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted">
        <img
          src={post.coverUrl}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-6 text-base">
        <p className="text-lg font-medium text-foreground leading-relaxed">
          {post.excerpt}
        </p>

        <p>
          Push rank di season ini memerlukan adaptasi cepat terhadap perubahan item dan hero balancer. Banyak pemain yang terjebak di rank yang sama bukan karena kurang bermain, melainkan karena mengabaikan detail kecil dalam strategi rotasi tim.
        </p>

        <h3 className="text-xl font-bold font-heading text-foreground pt-4">
          Pentingnya Memahami Timing Objektif Game
        </h3>
        <p>
          Ketika Turtle atau Lord muncul, pastikan jalur samping (side lane) sudah dalam kondisi gelombang minion terdorong. Hal ini memaksa setidaknya satu lawan untuk membersihkan minion atau menanggung resiko kehilangan turret.
        </p>

        {/* Call to Action Banner Inside Article */}
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-card to-accent/20 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-foreground font-heading">
              Butuh Diamond untuk Beli Skin Meta Terkini?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Top up Mobile Legends &amp; Free Fire instan mulai Rp 10.000 saja.
            </p>
          </div>
          <Button asChild className="shadow-glow shrink-0">
            <Link href="/top-up/mobile-legends">
              <Zap className="h-4 w-4 mr-1.5" />
              Beli Diamond Sekarang
            </Link>
          </Button>
        </div>

        <h3 className="text-xl font-bold font-heading text-foreground pt-4">
          Gunakan Layanan Joki Jika Waktu Bermain Anda Terbatas
        </h3>
        <p>
          Bagi para pekerja kantoran atau mahasiswa dengan jadwal padat, mengejar target skin season atau title rank bisa terasa melelahkan. Menggunakan layanan joki rank terpercaya dari pro player TopUpGame adalah solusi tepat untuk menjaga performa akun tanpa mengorbankan waktu istirahat Anda.
        </p>
      </div>

      {/* Back Button */}
      <div className="pt-8 border-t border-border">
        <Button asChild variant="outline">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Artikel
          </Link>
        </Button>
      </div>
    </article>
  );
}
