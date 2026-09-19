"use client";

import * as React from "react";
import {
  UserCheck,
  Star,
  Edit,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { DUMMY_JOKI_WORKERS } from "@/lib/dummy-data";
import { JokiWorkerItem } from "@/lib/types";
import { toast } from "sonner";

const AVAILABLE_GAMES = [
  "Mobile Legends",
  "Free Fire",
  "Valorant",
  "PUBG Mobile",
  "Honor of Kings",
  "Genshin Impact",
];

export default function AdminJokiWorkersPage() {
  const [workers, setWorkers] = React.useState<JokiWorkerItem[]>(DUMMY_JOKI_WORKERS);
  const [editWorker, setEditWorker] = React.useState<JokiWorkerItem | null>(null);
  const [commissionInput, setCommissionInput] = React.useState("75");
  const [verifyDialogOpen, setVerifyDialogOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Form State for Verifikasi Joki Baru
  const [displayName, setDisplayName] = React.useState("");
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [skillGames, setSkillGames] = React.useState<string[]>(["Mobile Legends"]);
  const [commissionPct, setCommissionPct] = React.useState(75);
  const [initialOnline, setInitialOnline] = React.useState(true);

  const filteredWorkers = workers.filter(
    (w) =>
      w.displayName.toLowerCase().includes(search.toLowerCase()) ||
      w.skillGames.some((g) => g.toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenEdit = (w: JokiWorkerItem) => {
    setEditWorker(w);
    setCommissionInput(w.commissionPct.toString());
  };

  const handleSaveCommission = () => {
    if (!editWorker) return;
    setWorkers(
      workers.map((w) =>
        w.id === editWorker.id
          ? { ...w, commissionPct: Number(commissionInput) }
          : w
      )
    );
    setEditWorker(null);
    toast.success(
      `Komisi untuk ${editWorker.displayName} diubah menjadi ${commissionInput}%! Tercatat di audit_logs.`
    );
  };

  const handleToggleOnline = (id: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextStatus = !w.isOnline;
          toast.success(
            `Status "${w.displayName}" diubah menjadi ${
              nextStatus ? "ONLINE (Siap Ambil Order)" : "OFFLINE (Standby)"
            }!`
          );
          return { ...w, isOnline: nextStatus };
        }
        return w;
      })
    );
  };

  const handleDeleteWorker = (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus verifikasi mitra joki "${name}"?`)) {
      return;
    }
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    toast.success(`Mitra joki "${name}" telah dinonaktifkan/dihapus.`);
  };

  const handleOpenVerify = () => {
    setDisplayName("");
    setEmailOrPhone("");
    setSkillGames(["Mobile Legends"]);
    setCommissionPct(75);
    setInitialOnline(true);
    setVerifyDialogOpen(true);
  };

  const handleSaveVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Nama lengkap atau nickname joki wajib diisi.");
      return;
    }
    if (skillGames.length === 0) {
      toast.error("Pilih minimal satu spesialisasi game.");
      return;
    }

    const newWorker: JokiWorkerItem = {
      id: `w-${Date.now()}`,
      userId: `u-joki-${Date.now().toString().slice(-4)}`,
      displayName: displayName.trim(),
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
      ratingAvg: 5.0,
      ratingCount: 0,
      skillGames: skillGames,
      isOnline: initialOnline,
      commissionPct: Number(commissionPct) || 75,
      activeOrders: 0,
    };

    setWorkers([newWorker, ...workers]);
    setVerifyDialogOpen(false);
    toast.success(
      `Mitra joki "${displayName}" berhasil diverifikasi dan siap menerima order!`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Kelola Mitra Joki Rank
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar pro-player terverifikasi, rating performa, dan pengaturan bagi hasil komisi
          </p>
        </div>

        <Button
          onClick={handleOpenVerify}
          size="sm"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Verifikasi Joki Baru
        </Button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nickname joki atau spesialisasi game..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>Spesialisasi Game</TableHead>
              <TableHead>Rating Pelanggan</TableHead>
              <TableHead>Order Selesai</TableHead>
              <TableHead>Beban Order</TableHead>
              <TableHead>Bagi Hasil Komisi</TableHead>
              <TableHead>Status (Online / Offline)</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkers.map((w) => (
              <TableRow key={w.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatarUrl}
                      alt={w.displayName}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                    />
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        {w.displayName}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                        Terverifikasi
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex flex-wrap gap-1">
                    {w.skillGames.map((game) => (
                      <Badge key={game} variant="outline" className="text-[10px] px-1.5 py-0">
                        {game}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-xs text-amber-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {w.ratingAvg} / 5.0
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {w.ratingCount} Order
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold">
                  {w.activeOrders} Aktif
                </TableCell>
                <TableCell>
                  <span className="font-price font-bold text-xs text-accent">
                    {w.commissionPct}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={w.isOnline}
                      onCheckedChange={() => handleToggleOnline(w.id)}
                    />
                    <Badge
                      variant={w.isOnline ? "success" : "outline"}
                      className="text-[10px] cursor-pointer select-none"
                      onClick={() => handleToggleOnline(w.id)}
                      title="Klik untuk mengubah status online/offline"
                    >
                      {w.isOnline ? "ONLINE" : "OFFLINE"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleOpenEdit(w)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Atur Komisi
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteWorker(w.id, w.displayName)}
                      title={`Hapus / Nonaktifkan ${w.displayName}`}
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

      {/* Edit Commission Modal */}
      {editWorker && (
        <Dialog open={!!editWorker} onOpenChange={() => setEditWorker(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Atur Bagi Hasil Komisi Joki</DialogTitle>
              <DialogDescription>
                Worker: <strong>{editWorker.displayName}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <Label>Persentase Komisi Worker (%)</Label>
                <Input
                  type="number"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(e.target.value)}
                  className="font-price font-bold text-accent"
                />
                <span className="text-[10px] text-muted-foreground">
                  Sisa {100 - Number(commissionInput)}% menjadi profit platform TopUpGame
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditWorker(null)}>
                Batal
              </Button>
              <Button onClick={handleSaveCommission} className="shadow-glow">
                Simpan Komisi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Verifikasi Joki Baru */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verifikasi Mitra Joki Baru</DialogTitle>
            <DialogDescription>
              Daftarkan pro-player yang lolos uji kompetensi rank dan tentukan komisi awal
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveVerify} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="jokiName">Nama Lengkap / Nickname Pro-Player *</Label>
              <Input
                id="jokiName"
                placeholder='Contoh: Rizky "Nightmare"'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jokiContact">Email atau No. WhatsApp *</Label>
              <Input
                id="jokiContact"
                placeholder="6281234567890 / joki@gmail.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Spesialisasi Game (Pilih yang dikuasai) *</Label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {AVAILABLE_GAMES.map((game) => {
                  const isSelected = skillGames.includes(game);
                  return (
                    <Badge
                      key={game}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer text-[11px] py-1 px-2.5 transition-all select-none"
                      onClick={() => {
                        if (isSelected) {
                          setSkillGames(skillGames.filter((g) => g !== game));
                        } else {
                          setSkillGames([...skillGames, game]);
                        }
                      }}
                    >
                      {game} {isSelected ? "✓" : "+"}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jokiComm">Bagi Hasil Komisi Worker (%) *</Label>
              <Input
                id="jokiComm"
                type="number"
                value={commissionPct}
                onChange={(e) => setCommissionPct(Number(e.target.value))}
                min={10}
                max={95}
                className="font-price font-bold text-accent"
                required
              />
              <span className="text-[10px] text-muted-foreground block">
                Sisa {100 - Number(commissionPct)}% menjadi profit platform TopUpGame
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-medium block">Status Ketersediaan Awal</span>
                <span className="text-[10px] text-muted-foreground">
                  Langsung online dan siap menerima antrian order
                </span>
              </div>
              <Switch
                checked={initialOnline}
                onCheckedChange={setInitialOnline}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVerifyDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="shadow-glow">
                Verifikasi &amp; Aktifkan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

