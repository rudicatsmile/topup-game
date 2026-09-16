import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DUMMY_GAMES } from "@/lib/dummy-data";

export default function DashboardTopUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-heading">
          Pilih Game untuk Top-Up Cepat
        </h1>
        <p className="text-xs text-muted-foreground">
          Pilih game favorit Anda dan isi diamond secara instan
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {DUMMY_GAMES.map((game) => (
          <Link
            key={game.id}
            href={`/top-up/${game.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-3 text-center transition-all hover:border-primary/60 hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-muted mb-2.5">
              <img
                src={game.logoUrl}
                alt={game.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <h3 className="font-bold text-xs line-clamp-1 group-hover:text-primary">
              {game.name}
            </h3>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {game.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
