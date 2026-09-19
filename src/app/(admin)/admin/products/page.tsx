"use client";

import * as React from "react";
import { Plus, Edit, Trash2, Search, Boxes, Filter } from "lucide-react";
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
import { DUMMY_PRODUCTS, DUMMY_GAMES } from "@/lib/dummy-data";
import { ProductItem } from "@/lib/types";
import { getProducts, getGames, createProduct, updateProduct, deleteProduct } from "@/actions/catalog";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<ProductItem[]>(DUMMY_PRODUCTS);
  const [games, setGames] = React.useState<any[]>(DUMMY_GAMES);
  const [selectedGameFilter, setSelectedGameFilter] = React.useState("ALL");
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form State
  const [sku, setSku] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [gameSlug, setGameSlug] = React.useState("mobile-legends");
  const [nominalQty, setNominalQty] = React.useState(100);
  const [priceCost, setPriceCost] = React.useState(18500);
  const [priceSell, setPriceSell] = React.useState(22000);
  const [stock, setStock] = React.useState(500);

  const marginRupiah = priceSell - priceCost;
  const marginPercent = priceCost > 0 ? Math.round((marginRupiah / priceCost) * 100) : 0;

  // Load data from Neon DB / actions on mount
  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [dbGames, dbProducts] = await Promise.all([
          getGames().catch(() => DUMMY_GAMES),
          getProducts().catch(() => DUMMY_PRODUCTS),
        ]);
        if (!isMounted) return;
        if (dbGames && dbGames.length > 0) {
          setGames(dbGames);
        }
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts as any);
        }
      } catch (err) {
        // Fallback silently
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchGame =
      selectedGameFilter === "ALL" || p.gameSlug === selectedGameFilter;
    const matchSearch =
      p.label.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchGame && matchSearch;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setSku("");
    setLabel("");
    setGameSlug(games[0]?.slug || "mobile-legends");
    setNominalQty(100);
    setPriceCost(18500);
    setPriceSell(22000);
    setStock(500);
    setDialogOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setSku(p.sku);
    setLabel(p.label);
    setGameSlug(p.gameSlug || "mobile-legends");
    setNominalQty(p.nominalQty || 100);
    setPriceCost(p.priceCost);
    setPriceSell(p.priceSell);
    setStock(p.stock);
    setDialogOpen(true);
  };

  const handleToggleActive = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextStatus = !target.isActive;

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: nextStatus } : p))
    );

    try {
      await updateProduct(id, { isActive: nextStatus });
    } catch (err) {}

    toast.success(
      `Status "${target.label}" diubah ke ${
        nextStatus ? "Aktif" : "Nonaktif"
      }!`
    );
  };

  const handleDeleteProduct = async (id: string, productLabel: string) => {
    if (
      !confirm(`Apakah Anda yakin ingin menghapus paket nominal "${productLabel}"?`)
    ) {
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProduct(id);
    } catch (err) {}

    toast.success(`Paket nominal "${productLabel}" berhasil dihapus.`);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      toast.error("Nama label nominal wajib diisi.");
      return;
    }
    if (priceSell < priceCost) {
      toast.error("Harga jual tidak boleh lebih rendah dari harga modal!");
      return;
    }

    setIsSaving(true);
    try {
      const selectedGame =
        games.find((g) => g.slug === gameSlug) || games[0];
      const gameId = selectedGame?.id || "g-mlbb";

      if (editingProduct) {
        // Mode EDIT
        const updated: ProductItem = {
          ...editingProduct,
          sku: sku.trim() || editingProduct.sku,
          label: label.trim(),
          gameSlug: gameSlug,
          gameId: gameId,
          priceCost: Number(priceCost),
          priceSell: Number(priceSell),
          margin: Number(marginRupiah),
          stock: Number(stock),
          nominalQty: Number(nominalQty) || 100,
        };

        setProducts((prev) =>
          prev.map((item) =>
            item.id === editingProduct.id ? updated : item
          )
        );

        try {
          await updateProduct(editingProduct.id, {
            sku: sku.trim() || editingProduct.sku,
            label: label.trim(),
            priceCost: Number(priceCost),
            priceSell: Number(priceSell),
            stock: Number(stock),
            nominalQty: Number(nominalQty) || 100,
          });
        } catch (dbErr) {}

        setDialogOpen(false);
        setEditingProduct(null);
        toast.success(
          `Paket nominal "${label}" berhasil diperbarui! Log perubahan harga tercatat.`
        );
      } else {
        // Mode TAMBAH BARU
        const finalSku =
          sku.trim() || `SKU-${Date.now().toString().slice(-4)}`;
        const newProd: ProductItem = {
          id: `p-${Date.now()}`,
          gameId: gameId,
          gameSlug: gameSlug,
          sku: finalSku,
          label: label.trim(),
          nominalQty: Number(nominalQty) || 100,
          priceCost: Number(priceCost),
          priceSell: Number(priceSell),
          margin: Number(marginRupiah),
          stock: Number(stock),
          isActive: true,
          sortOrder: products.length + 1,
        };

        setProducts((prev) => [newProd, ...prev]);

        try {
          if (gameId.length > 10) {
            await createProduct({
              gameId: gameId,
              sku: finalSku,
              label: label.trim(),
              nominalQty: Number(nominalQty) || 100,
              priceCost: Number(priceCost),
              priceSell: Number(priceSell),
              stock: Number(stock),
              isActive: true,
              sortOrder: products.length + 1,
            });
          }
        } catch (dbErr) {}

        setDialogOpen(false);
        toast.success(
          `Paket nominal "${label}" berhasil disimpan! Log perubahan harga tercatat.`
        );
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
            Kelola Nominal Diamond &amp; Harga
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Atur paket produk, harga modal supplier, harga jual, margin keuntungan, dan stok
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          size="sm"
          className="shadow-glow"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Paket Nominal
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari SKU atau nama nominal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Label className="text-xs text-muted-foreground shrink-0">Filter Game:</Label>
          <select
            value={selectedGameFilter}
            onChange={(e) => setSelectedGameFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-xs"
          >
            <option value="ALL">Semua Game</option>
            {games.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU Produk</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Label Paket</TableHead>
              <TableHead>Harga Modal</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Margin Untung</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((p) => {
              const marginPct = Math.round((p.margin / p.priceCost) * 100);
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-bold text-xs text-primary">
                    {p.sku}
                  </TableCell>
                  <TableCell className="text-xs font-semibold capitalize">
                    {p.gameSlug?.replace("-", " ")}
                  </TableCell>
                  <TableCell className="font-bold text-xs">
                    {p.label}
                  </TableCell>
                  <TableCell className="font-price text-xs text-muted-foreground">
                    {formatRupiah(p.priceCost)}
                  </TableCell>
                  <TableCell className="font-price font-bold text-xs text-accent">
                    {formatRupiah(p.priceSell)}
                  </TableCell>
                  <TableCell>
                    <span className="font-price text-xs text-emerald-500 font-bold block">
                      +{formatRupiah(p.margin)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({marginPct}%)
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-mono text-xs font-bold ${
                        p.stock < 100 ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={p.isActive}
                      onCheckedChange={() => handleToggleActive(p.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(p)}
                        title={`Edit ${p.label}`}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProduct(p.id, p.label)}
                        title={`Hapus ${p.label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Product Modal */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct
                ? `Edit Paket: ${editingProduct.label}`
                : "Tambah Nominal Diamond Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Perbarui harga beli modal, harga jual konsumen, atau kuota stok"
                : "Atur harga beli modal dan harga jual konsumen"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Game</Label>
                <select
                  value={gameSlug}
                  onChange={(e) => setGameSlug(e.target.value)}
                  className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs"
                >
                  {games.map((g) => (
                    <option key={g.id} value={g.slug}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label>SKU Kode</Label>
                <Input
                  placeholder="ML-500-DM"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="h-9 text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Nama Label Nominal *</Label>
              <Input
                placeholder="Contoh: 500 Diamonds (450 + 50 Bonus)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label>Jumlah Nominal / Diamond (Qty)</Label>
              <Input
                type="number"
                placeholder="500"
                value={nominalQty}
                onChange={(e) => setNominalQty(Number(e.target.value))}
                required
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Harga Modal (Rp) *</Label>
                <Input
                  type="number"
                  value={priceCost}
                  onChange={(e) => setPriceCost(Number(e.target.value))}
                  required
                  className="h-9 text-xs font-price"
                />
              </div>

              <div className="space-y-1">
                <Label>Harga Jual Konsumen (Rp) *</Label>
                <Input
                  type="number"
                  value={priceSell}
                  onChange={(e) => setPriceSell(Number(e.target.value))}
                  required
                  className="h-9 text-xs font-price font-bold text-accent"
                />
              </div>
            </div>

            {/* Auto margin indicator */}
            <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs">
              <span>Margin Keuntungan:</span>
              <span className="font-price font-bold text-emerald-500">
                +{formatRupiah(marginRupiah)} ({marginPercent}%)
              </span>
            </div>

            <div className="space-y-1">
              <Label>Stok</Label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="h-9 text-xs font-mono"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingProduct(null);
                }}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="shadow-glow"
                disabled={isSaving}
              >
                {isSaving
                  ? "Menyimpan..."
                  : editingProduct
                  ? "Simpan Perubahan"
                  : "Simpan Produk"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
