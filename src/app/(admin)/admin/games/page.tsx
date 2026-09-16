"use client";

import * as React from "react";
import { Plus, Edit, Trash2, Search, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DUMMY_GAMES } from "@/lib/dummy-data";
import { GameItem } from "@/lib/types";
import { toast } from "sonner";

export default function AdminGamesPage() {
  const [games, setGames] = React.useState<GameItem[]>(DUMMY_GAMES);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    publisher: "",
    category: "MOBA",
    platform: "Mobile",
    needsZoneId: false,
    hasJoki: true,
  });

  const filteredGames = games.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.publisher.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = (id: string) => {
    setGames(
      games.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
    toast.success("Status game berhasil diubah!");
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.publisher) {
      toast.error("Nama game dan publisher wajib diisi.");
      return;
    }

    const newGame: GameItem = {
      id: `g-${Date.now()}`,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      publisher: formData.publisher,
      category: formData.category as any,
      platform: formData.platform as any,
      logoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60",
      bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
      needsZoneId: formData.needsZoneId,
      hasJoki: formData.hasJoki,
      isActive: true,
      sortOrder: games.length + 1,
    };

    setGames([newGame, ...games]);
    setDialogOpen(false);
    toast.success(`Game "${formData.name}" berhasil ditambahkan ke katalog.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Kelola Katalog Game
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar game yang didukung untuk layanan top-up diamond dan joki rank
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          size="sm"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Game Baru
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari game atau publisher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Games Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Zone ID</TableHead>
              <TableHead>Joki Rank</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGames.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={game.logoUrl}
                      alt={game.name}
                      className="h-9 w-9 rounded-lg object-cover bg-muted"
                    />
                    <div>
                      <span className="font-bold text-xs block text-foreground">
                        {game.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        /{game.slug}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {game.publisher}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">
                    {game.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{game.platform}</TableCell>
                <TableCell className="text-xs font-semibold">
                  {game.needsZoneId ? "Wajib" : "Tidak"}
                </TableCell>
                <TableCell>
                  {game.hasJoki ? (
                    <span className="text-xs font-bold text-accent">Aktif</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={game.isActive}
                    onCheckedChange={() => handleToggleActive(game.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Game Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Game Baru</DialogTitle>
            <DialogDescription>
              Tambahkan judul game baru ke dalam katalog sistem TopUpGame
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateGame} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="gameName">Nama Game *</Label>
              <Input
                id="gameName"
                placeholder="Contoh: Honor of Kings"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gamePublisher">Publisher *</Label>
              <Input
                id="gamePublisher"
                placeholder="Contoh: Level Infinite"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat">Kategori</Label>
                <select
                  id="cat"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="MOBA">MOBA</option>
                  <option value="Battle Royale">Battle Royale</option>
                  <option value="FPS">FPS</option>
                  <option value="RPG">RPG</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plat">Platform</Label>
                <select
                  id="plat"
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-xs"
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                >
                  <option value="Mobile">Mobile</option>
                  <option value="PC">PC</option>
                  <option value="Semua Platform">Semua Platform</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs">Memerlukan Zone ID / Server?</span>
              <Switch
                checked={formData.needsZoneId}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, needsZoneId: val })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs">Sediakan Layanan Joki Rank?</span>
              <Switch
                checked={formData.hasJoki}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, hasJoki: val })
                }
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="shadow-glow">
                Simpan Game
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
