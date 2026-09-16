"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Zap, Filter, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DUMMY_GAMES } from "@/lib/dummy-data";

export default function TopUpCatalogPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Semua");
  const [selectedPlatform, setSelectedPlatform] = React.useState("Semua");

  const categories = ["Semua", "MOBA", "Battle Royale", "FPS", "RPG"];
  const platforms = ["Semua", "Mobile", "PC"];

  const filteredGames = DUMMY_GAMES.filter((game) => {
    const matchSearch =
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.publisher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "Semua" || game.category === selectedCategory;
    const matchPlat =
      selectedPlatform === "Semua" ||
      game.platform === selectedPlatform ||
      game.platform === "Semua Platform";
    return matchSearch && matchCat && matchPlat;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/20 via-card to-accent/10 p-6 sm:p-10 border border-primary/20">
        <div className="max-w-2xl space-y-3">
          <Badge variant="gaming" className="font-bold">
            KATALOG TOP-UP INSTAN
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
            Pilih Game &amp; Top-Up Sekarang
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Temukan voucher &amp; diamond untuk game favorit Anda dengan harga paling bersahabat dan konfirmasi otomatis tanpa antre.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama game atau publisher..."
            className="pl-10 h-11 rounded-xl bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className="rounded-xl h-9 text-xs"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {filteredGames.map((game) => (
          <Link
            key={game.id}
            href={`/top-up/${game.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card p-3.5 text-center transition-all duration-200 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-glow"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted mb-3">
              <img
                src={game.logoUrl}
                alt={game.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {game.hasJoki && (
                <span className="absolute top-2 right-2 rounded-md bg-accent px-1.5 py-0.5 text-[9px] font-extrabold text-black shadow">
                  + JOKI
                </span>
              )}
            </div>
            <h3 className="font-heading font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {game.name}
            </h3>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="text-[11px] text-muted-foreground">
                {game.publisher}
              </span>
              <span className="text-[10px] text-muted-foreground/60">•</span>
              <span className="text-[10px] text-accent font-semibold">
                {game.category}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-base font-semibold text-muted-foreground">
            Game yang Anda cari tidak ditemukan.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Semua");
            }}
          >
            Reset Pencarian
          </Button>
        </div>
      )}
    </div>
  );
}
