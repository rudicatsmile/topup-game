"use client";

import * as React from "react";
import { UserCheck, Star, Edit, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

export default function AdminJokiWorkersPage() {
  const [workers, setWorkers] = React.useState<JokiWorkerItem[]>(DUMMY_JOKI_WORKERS);
  const [editWorker, setEditWorker] = React.useState<JokiWorkerItem | null>(null);
  const [commissionInput, setCommissionInput] = React.useState("75");

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
    toast.success(`Komisi untuk ${editWorker.displayName} diubah menjadi ${commissionInput}%! Tercatat di audit_logs.`);
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

        <Button size="sm" className="shadow-glow">
          <Plus className="h-4 w-4 mr-1.5" />
          Verifikasi Joki Baru
        </Button>
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((w) => (
              <TableRow key={w.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatarUrl}
                      alt={w.displayName}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                    />
                    <span className="font-bold text-xs text-foreground">
                      {w.displayName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {w.skillGames.join(", ")}
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
                  <Badge variant={w.isOnline ? "success" : "outline"} className="text-[10px]">
                    {w.isOnline ? "ONLINE" : "OFFLINE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => handleOpenEdit(w)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Atur Komisi
                  </Button>
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
    </div>
  );
}
