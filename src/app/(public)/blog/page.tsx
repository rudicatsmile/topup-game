import Link from "next/link";
import { Clock, Calendar, ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_BLOG_POSTS } from "@/lib/dummy-data";

export default function BlogListPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="max-w-2xl space-y-3">
        <Badge variant="gaming" className="font-bold">
          TIPS, TRIK &amp; BERITA GAMING
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Pusat Pengetahuan &amp; Info Meta
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Panduan push rank, bocoran patch terbaru, serta rekomendasi hero dan item dari pro-player TopUpGame.
        </p>
      </div>

      {/* Blog Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DUMMY_BLOG_POSTS.map((post) => (
          <Card
            key={post.id}
            className="group overflow-hidden rounded-2xl border-border bg-card flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={post.coverUrl}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge variant="accent" className="absolute top-3 left-3 font-bold">
                {post.category}
              </Badge>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

                <h2 className="text-xl font-bold font-heading group-hover:text-primary transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground">
                  Oleh {post.author}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Baca Selengkapnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
