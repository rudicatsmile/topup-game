"use client";

import * as React from "react";
import { Search, RefreshCw, Eye, CheckCircle2, AlertCircle } from "lucide-react";
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
import { DUMMY_TOPUP_ORDERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminTopUpOrdersPage() {
  const [orders, setOrders] = React.useState(DUMMY_TOPUP_ORDERS);
  const [search, setSearch] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);

  const handleRetrySupplier = (invoiceId: string) => {
    toast.success(`Retry order ${invoiceId} ke API supplier Digiflazz berhasil dipicu!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Manajemen Order Top-Up Diamond
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau seluruh transaksi top-up otomatis, sinkronisasi supplier, dan retry proses
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari invoice, nickname, atau User ID..."
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
              <TableHead>No. Invoice</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Game &amp; Item</TableHead>
              <TableHead>User &amp; Zone ID</TableHead>
              <TableHead>Total Bayar</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((ord) => (
              <TableRow key={ord.id}>
                <TableCell className="font-mono font-bold text-xs text-primary">
                  {ord.invoiceId}
                  <span className="block font-sans font-normal text-[10px] text-muted-foreground">
                    {formatDate(ord.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-semibold">
                  {ord.userName || "Rizky Aditya"}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-xs block">{ord.gameName}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {ord.productLabel}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {ord.gameUserId} {ord.gameZoneId ? `(${ord.gameZoneId})` : ""}
                </TableCell>
                <TableCell className="font-price font-bold text-xs text-accent">
                  {formatRupiah(ord.total)}
                </TableCell>
                <TableCell className="text-xs">
                  {ord.paymentMethodLabel || ord.paymentMethod}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ord.status === "SUCCESS"
                        ? "success"
                        : ord.status === "PROCESSING"
                        ? "accent"
                        : "warning"
                    }
                    className="text-[10px]"
                  >
                    {ord.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedOrder(ord)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Lihat
                  </Button>
                  {ord.status !== "SUCCESS" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleRetrySupplier(ord.invoiceId)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Detail Order */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rincian Order: {selectedOrder.invoiceId}</DialogTitle>
              <DialogDescription>
                Detail verifikasi dan response supplier API
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-xl bg-muted/50 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pelanggan:</span>
                  <span className="font-bold">{selectedOrder.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tujuan:</span>
                  <span className="font-mono font-bold">
                    {selectedOrder.gameUserId} ({selectedOrder.gameNickname || "RizkySlayer"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produk:</span>
                  <span className="font-semibold">{selectedOrder.productLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier Ref:</span>
                  <span className="font-mono text-primary">DF-REF-9921401</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/30 border border-border font-mono text-[11px] text-muted-foreground space-y-1">
                <span className="font-bold text-foreground block">
                  Supplier Raw Payload:
                </span>
                <pre className="text-[10px] overflow-x-auto">
{`{
  "status": "RC-00",
  "message": "Transaksi Berhasil Dikirim",
  "sn": "1092837198273192",
  "rc": "00"
}`}
                </pre>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
