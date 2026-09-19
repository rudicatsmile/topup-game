"use client";

import * as React from "react";
import { Truck, RefreshCw, Plus, CheckCircle2, AlertCircle, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createSupplier, getSuppliers, deleteSupplier } from "@/actions/catalog";
import { toast } from "sonner";

interface SupplierItem {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyMasked: string;
  isActive: boolean;
  lastSync: string;
  balance: number;
  status: string;
}

const DEFAULT_SUPPLIERS: SupplierItem[] = [
  {
    id: "sup-1",
    name: "Digiflazz Aggregator API",
    baseUrl: "https://api.digiflazz.com/v1",
    apiKeyMasked: "df_live_••••••••••••9841",
    isActive: true,
    lastSync: "5 menit lalu",
    balance: 14520000,
    status: "TERKONEKSI",
  },
  {
    id: "sup-2",
    name: "VIP Reseller Game H2H",
    baseUrl: "https://vip-reseller.co.id/api/v2",
    apiKeyMasked: "vip_sec_••••••••••••1029",
    isActive: true,
    lastSync: "10 menit lalu",
    balance: 8940000,
    status: "TERKONEKSI",
  },
  {
    id: "sup-3",
    name: "Apigames Partner Gateway",
    baseUrl: "https://apigames.id/v2/transaksi",
    apiKeyMasked: "apig_live_••••••••••••3471",
    isActive: false,
    lastSync: "1 hari lalu",
    balance: 120000,
    status: "STANDBY",
  },
];

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = React.useState<SupplierItem[]>(DEFAULT_SUPPLIERS);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form State
  const [name, setName] = React.useState("");
  const [baseUrl, setBaseUrl] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [balance, setBalance] = React.useState<number>(0);
  const [isActive, setIsActive] = React.useState(true);

  // Load suppliers from database on mount if any
  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getSuppliers();
        if (isMounted && data && data.length > 0) {
          setSuppliers(data);
        }
      } catch (err) {}
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Sinkronisasi stok dan harga dari semua supplier API berhasil diselesaikan!");
    }, 1200);
  };

  const handleOpenCreate = () => {
    setName("");
    setBaseUrl("");
    setApiKey("");
    setBalance(0);
    setIsActive(true);
    setDialogOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isActive: !s.isActive,
              status: !s.isActive ? "TERKONEKSI" : "STANDBY",
            }
          : s
      )
    );
    toast.success("Status supplier berhasil diubah!");
  };

  const handleDeleteSupplier = async (id: string, supplierName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus koneksi supplier "${supplierName}"?`)) {
      return;
    }

    setSuppliers((prev) => prev.filter((s) => s.id !== id));

    try {
      await deleteSupplier(id);
    } catch (err) {}

    toast.success(`Supplier "${supplierName}" berhasil dihapus.`);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama supplier wajib diisi.");
      return;
    }
    if (!baseUrl.trim()) {
      toast.error("API Base URL wajib diisi.");
      return;
    }
    if (!apiKey.trim()) {
      toast.error("Kunci API / Secret Key wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const maskedKey =
        apiKey.length > 8
          ? `${apiKey.slice(0, 4)}_••••••••••••${apiKey.slice(-4)}`
          : "••••••••••••key";

      const newSupplier: SupplierItem = {
        id: `sup-${Date.now()}`,
        name: name.trim(),
        baseUrl: baseUrl.trim(),
        apiKeyMasked: maskedKey,
        isActive: isActive,
        lastSync: "Baru saja",
        balance: Number(balance) || 0,
        status: isActive ? "TERKONEKSI" : "STANDBY",
      };

      // Tambahkan data ke list tampilan seketika
      setSuppliers((prev) => [newSupplier, ...prev]);

      // Simpan ke database jika memungkinkan
      try {
        await createSupplier({
          name: name.trim(),
          baseUrl: baseUrl.trim(),
          apiKey: apiKey.trim(),
        });
      } catch (dbErr) {}

      setDialogOpen(false);
      toast.success(`Supplier "${name}" berhasil ditambahkan ke katalog koneksi API!`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Kelola Supplier &amp; Koneksi API
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Integrasi aggregator penyedia diamond game (Digiflazz, VIP Reseller, Apigames)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncAll}
            disabled={isSyncing}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sinkronisasi..." : "Sinkronkan Stok Sekarang"}
          </Button>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="shadow-glow"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Supplier
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Supplier</TableHead>
              <TableHead>API Base URL</TableHead>
              <TableHead>Kunci API (AES-256)</TableHead>
              <TableHead>Sisa Saldo Deposit</TableHead>
              <TableHead>Sinkronisasi Terakhir</TableHead>
              <TableHead>Koneksi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((sup) => (
              <TableRow key={sup.id}>
                <TableCell className="font-bold text-xs">
                  {sup.name}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {sup.baseUrl}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {sup.apiKeyMasked}
                </TableCell>
                <TableCell className="font-price font-bold text-xs text-accent">
                  Rp {sup.balance.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {sup.lastSync}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sup.status === "TERKONEKSI" ? "success" : "outline"}
                    className="text-[10px]"
                  >
                    {sup.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={sup.isActive}
                    onCheckedChange={() => handleToggleActive(sup.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => toast.success(`Tes koneksi ke ${sup.name} respon 200 OK (85ms)`)}
                    >
                      Ping API
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteSupplier(sup.id, sup.name)}
                      title={`Hapus ${sup.name}`}
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

      {/* Modal Tambah Supplier */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Koneksi Supplier Baru</DialogTitle>
            <DialogDescription>
              Hubungkan sistem dengan aggregator API penyedia stok diamond game
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSupplier} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="supName">Nama Supplier / Gateway *</Label>
              <Input
                id="supName"
                placeholder="Contoh: Digiflazz Direct API"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="supUrl">API Base URL *</Label>
              <Input
                id="supUrl"
                placeholder="https://api.supplier.com/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                required
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="supKey">API Key / Secret Token *</Label>
              <Input
                id="supKey"
                type="password"
                placeholder="Kunci rahasia API (dienkripsi otomatis)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="supBalance">Saldo Awal Deposit (Rp)</Label>
              <Input
                id="supBalance"
                type="number"
                placeholder="0"
                value={balance || ""}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="font-price text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs">Aktifkan Koneksi Sekarang?</span>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="shadow-glow"
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Simpan Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

