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
import { getGames, createGame, updateGame, deleteGame } from "@/actions/catalog";
import { toast } from "sonner";

const initialFormData = {
  name: "",
  slug: "",
  publisher: "",
  category: "MOBA",
  platform: "Mobile",
  logoUrl: "",
  bannerUrl: "",
  needsZoneId: false,
  hasJoki: true,
};

export default function AdminGamesPage() {
  const [games, setGames] = React.useState<GameItem[]>(DUMMY_GAMES);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingGame, setEditingGame] = React.useState<GameItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState(initialFormData);

  // Load games from database (Neon DB) on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const dbGames = await getGames();
        if (isMounted && dbGames && dbGames.length > 0) {
          setGames(
            dbGames.map((g: any) => ({
              ...g,
              platform:
                g.platform === "mobile"
                  ? "Mobile"
                  : g.platform === "pc"
                  ? "PC"
                  : g.platform === "both"
                  ? "Semua Platform"
                  : g.platform || "Mobile",
            }))
          );
        }
      } catch (err) {
        // Fallback to DUMMY_GAMES if error
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredGames = games.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.publisher.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingGame(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  const handleOpenEdit = (game: GameItem) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      slug: game.slug,
      publisher: game.publisher,
      category: game.category,
      platform: game.platform,
      logoUrl: game.logoUrl || "",
      bannerUrl: game.bannerUrl || "",
      needsZoneId: game.needsZoneId,
      hasJoki: game.hasJoki,
    });
    setDialogOpen(true);
  };

  const handleToggleActive = async (id: string) => {
    const target = games.find((g) => g.id === id);
    if (!target) return;
    const nextStatus = !target.isActive;

    setGames(
      games.map((g) => (g.id === id ? { ...g, isActive: nextStatus } : g))
    );

    try {
      await updateGame(id, { isActive: nextStatus });
    } catch (dbErr) {}

    toast.success(
      `Status game "${target.name}" diubah ke ${
        nextStatus ? "Aktif" : "Nonaktif"
      }!`
    );
  };

  const handleDeleteGame = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus game "${name}" dari katalog?`)) {
      return;
    }

    setGames((prev) => prev.filter((g) => g.id !== id));

    try {
      await deleteGame(id);
    } catch (dbErr) {}

    toast.success(`Game "${name}" berhasil dihapus dari katalog.`);
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.publisher) {
      toast.error("Nama game dan publisher wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const rawPlatform =
        formData.platform.toLowerCase() === "semua platform"
          ? "both"
          : (formData.platform.toLowerCase() as "mobile" | "pc" | "both");

      if (editingGame) {
        // Mode EDIT
        const updatedGame: GameItem = {
          ...editingGame,
          name: formData.name,
          slug:
            formData.slug.trim() ||
            formData.name.toLowerCase().replace(/\s+/g, "-"),
          publisher: formData.publisher,
          category: formData.category as any,
          platform: formData.platform as any,
          logoUrl: formData.logoUrl || editingGame.logoUrl,
          bannerUrl: formData.bannerUrl || editingGame.bannerUrl,
          needsZoneId: formData.needsZoneId,
          hasJoki: formData.hasJoki,
        };

        setGames((prev) =>
          prev.map((g) => (g.id === editingGame.id ? updatedGame : g))
        );

        try {
          await updateGame(editingGame.id, {
            name: formData.name,
            slug:
              formData.slug.trim() ||
              formData.name.toLowerCase().replace(/\s+/g, "-"),
            publisher: formData.publisher,
            category: formData.category,
            platform: rawPlatform,
            needsZoneId: formData.needsZoneId,
            hasJoki: formData.hasJoki,
            logoUrl: formData.logoUrl || editingGame.logoUrl,
            bannerUrl: formData.bannerUrl || editingGame.bannerUrl,
          });
        } catch (dbErr) {
          // Fallback gracefully jika demo/unauthenticated
        }

        setDialogOpen(false);
        setEditingGame(null);
        toast.success(`Game "${formData.name}" berhasil diperbarui!`);
      } else {
        // Mode TAMBAH BARU
        const newSlug =
          formData.slug.trim() ||
          formData.name.toLowerCase().replace(/\s+/g, "-");

        const newGame: GameItem = {
          id: `g-${Date.now()}`,
          slug: newSlug,
          name: formData.name,
          publisher: formData.publisher,
          category: formData.category as any,
          platform: formData.platform as any,
          logoUrl:
            formData.logoUrl ||
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60",
          bannerUrl:
            formData.bannerUrl ||
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
          needsZoneId: formData.needsZoneId,
          hasJoki: formData.hasJoki,
          isActive: true,
          sortOrder: games.length + 1,
        };

        setGames((prev) => [newGame, ...prev]);

        try {
          await createGame({
            slug: newSlug,
            name: formData.name,
            publisher: formData.publisher,
            category: formData.category,
            platform: rawPlatform,
            needsZoneId: formData.needsZoneId,
            hasJoki: formData.hasJoki,
            logoUrl: newGame.logoUrl,
            bannerUrl: newGame.bannerUrl,
            isActive: true,
            sortOrder: games.length + 1,
          });
        } catch (dbErr) {}

        setDialogOpen(false);
        toast.success(`Game "${formData.name}" berhasil ditambahkan ke katalog.`);
      }
    } finally {
      setIsSaving(false);
    }
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
          onClick={handleOpenCreate}
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
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(game)}
                      title={`Edit ${game.name}`}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteGame(game.id, game.name)}
                      title={`Hapus ${game.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Game Modal */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingGame(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGame ? `Edit Game: ${editingGame.name}` : "Tambah Game Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingGame
                ? "Perbarui informasi katalog game yang dipilih"
                : "Tambahkan judul game baru ke dalam katalog sistem TopUpGame"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveGame} className="space-y-4 py-2">
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="gameSlug">Slug / URL</Label>
                <Input
                  id="gameSlug"
                  placeholder="otomatis jika kosong"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="font-mono text-xs"
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
                  <option value="Strategy">Strategy</option>
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

            <div className="space-y-1.5">
              <Label htmlFor="logoUrl">URL Logo Icon</Label>
              <Input
                id="logoUrl"
                placeholder="https://..."
                value={formData.logoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, logoUrl: e.target.value })
                }
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bannerUrl">URL Banner Gambar</Label>
              <Input
                id="bannerUrl"
                placeholder="https://..."
                value={formData.bannerUrl}
                onChange={(e) =>
                  setFormData({ ...formData, bannerUrl: e.target.value })
                }
                className="text-xs"
              />
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
                onClick={() => {
                  setDialogOpen(false);
                  setEditingGame(null);
                }}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button type="submit" className="shadow-glow" disabled={isSaving}>
                {isSaving
                  ? "Menyimpan..."
                  : editingGame
                  ? "Simpan Perubahan"
                  : "Simpan Game"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
