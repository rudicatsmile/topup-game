"use client";

import * as React from "react";
import { Flame, UserCheck, Search, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DUMMY_JOKI_ORDERS, DUMMY_JOKI_WORKERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminJokiOrdersPage() {
  const [orders, setOrders] = React.useState(DUMMY_JOKI_ORDERS);
  const [assignModalOpen, setAssignModalOpen] = React.useState(false);
  const [targetOrder, setTargetOrder] = React.useState<any>(null);
  const [selectedWorkerId, setSelectedWorkerId] = React.useState("w-1");

  const handleOpenAssign = (ord: any) => {
    setTargetOrder(ord);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    const worker = DUMMY_JOKI_WORKERS.find((w) => w.id === selectedWorkerId);
    setOrders(
      orders.map((o) =>
        o.id === targetOrder.id ? { ...o, workerName: worker?.displayName } : o
      )
    );
    setAssignModalOpen(false);
    toast.success(`Order ${targetOrder.invoiceId} berhasil dialihkan ke ${worker?.displayName}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Manajemen Order Joki Rank
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar pesanan joki rank, penugasan worker pro, dan pengawasan status kemenangan
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Joki</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Rank Target</TableHead>
              <TableHead>Worker Joki</TableHead>
              <TableHead>Progres</TableHead>
              <TableHead>Komisi Joki</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((ord) => (
              <TableRow key={ord.id}>
                <TableCell className="font-mono font-bold text-xs text-primary">
                  {ord.invoiceId}
                  <span className="block text-[10px] text-muted-foreground font-sans">
                    {formatDate(ord.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-semibold">
                  {ord.userName}
                </TableCell>
                <TableCell className="text-xs">{ord.gameName}</TableCell>
                <TableCell className="text-xs">
                  <span className="text-muted-foreground">{ord.startTierName}</span>
                  <span className="block font-bold text-foreground">
                    → {ord.targetTierName}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-bold text-accent">
                  {ord.workerName || "Belum Ditugaskan"}
                </TableCell>
                <TableCell>
                  <div className="space-y-1 w-24">
                    <span className="text-[10px] font-bold block">
                      {ord.progressPercent}%
                    </span>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${ord.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-price text-xs text-emerald-500 font-bold">
                  {formatRupiah(ord.workerCommission || 105000)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={ord.status === "ON_PROGRESS" ? "accent" : "success"}
                    className="text-[10px]"
                  >
                    {ord.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => handleOpenAssign(ord)}
                  >
                    <UserCheck className="h-3 w-3 mr-1" />
                    Assign Joki
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Assign Worker Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tugaskan Mitra Joki Worker</DialogTitle>
            <DialogDescription>
              Pilih worker pro yang siap mengeksekusi order {targetOrder?.invoiceId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-2">
              {DUMMY_JOKI_WORKERS.map((w) => (
                <div
                  key={w.id}
                  onClick={() => setSelectedWorkerId(w.id)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                    selectedWorkerId === w.id
                      ? "border-accent bg-accent/10 ring-1 ring-accent"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatarUrl}
                      alt={w.displayName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-bold text-foreground block">
                        {w.displayName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Rating: {w.ratingAvg} ★ • Order aktif: {w.activeOrders}
                      </span>
                    </div>
                  </div>
                  <Badge variant={w.isOnline ? "success" : "outline"} className="text-[9px]">
                    {w.isOnline ? "ONLINE" : "OFFLINE"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              size="sm"
              variant="accent"
              className="shadow-glow-accent"
              onClick={handleConfirmAssign}
            >
              Tugaskan Worker Ini
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
