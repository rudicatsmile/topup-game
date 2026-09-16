"use client";

import * as React from "react";
import {
  ShieldCheck,
  Search,
  Lock,
  Eye,
  FileCode,
  Calendar,
  AlertTriangle,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DUMMY_AUDIT_LOGS } from "@/lib/dummy-data";
import { AuditLogItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs] = React.useState<AuditLogItem[]>(DUMMY_AUDIT_LOGS);
  const [search, setSearch] = React.useState("");
  const [selectedEntity, setSelectedEntity] = React.useState("ALL");
  const [selectedLog, setSelectedLog] = React.useState<AuditLogItem | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      l.entityType.toLowerCase().includes(search.toLowerCase());
    const matchEntity =
      selectedEntity === "ALL" || l.entityType === selectedEntity;
    return matchSearch && matchEntity;
  });

  return (
    <div className="space-y-6">
      {/* Header with Immutable Security Guarantee */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">
              Audit Log Sistem (Immutable)
            </h1>
            <Badge variant="success" className="text-xs font-bold">
              PROTECTED INSERT-ONLY
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Semua perubahan pesanan, pembayaran, harga produk, stok, dan akses kredensial dicatat permanen
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari aktor, referensi invoice, atau entitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-xs"
          >
            <option value="ALL">Semua Entitas</option>
            <option value="product_price">product_price</option>
            <option value="order_topup">order_topup</option>
            <option value="order_joki">order_joki</option>
            <option value="order_joki_credentials">order_joki_credentials</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aktor (Pelaku)</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Tipe Entitas</TableHead>
              <TableHead>Kode Referensi</TableHead>
              <TableHead>Alamat IP</TableHead>
              <TableHead>Waktu Kejadian</TableHead>
              <TableHead className="text-right">JSON Diff</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <span className="font-bold text-xs block text-foreground">
                    {log.actorName}
                  </span>
                  <Badge variant="outline" className="text-[9px] uppercase">
                    {log.actorRole}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.action === "READ_SENSITIVE"
                        ? "destructive"
                        : log.action === "CREATE"
                        ? "success"
                        : "default"
                    }
                    className="text-[10px] font-mono"
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-accent font-semibold">
                  {log.entityType}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-foreground">
                  {log.referenceCode}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {log.ipAddress}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(log.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => setSelectedLog(log)}
                  >
                    <FileCode className="h-3.5 w-3.5 mr-1 text-primary" />
                    Lihat Diff
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal JSON Diff View */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <span>Audit Log Entry: {selectedLog.id}</span>
              </DialogTitle>
              <DialogDescription>
                Aktor: {selectedLog.actorName} ({selectedLog.actorRole}) • Entitas: {selectedLog.entityType}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 font-mono text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Aksi Terdata:</span>
                  <span className="font-bold text-foreground">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Waktu:</span>
                  <span className="font-bold text-foreground">{formatDate(selectedLog.createdAt)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">IP Pengakses:</span>
                  <span className="text-foreground">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Referensi:</span>
                  <span className="font-bold text-primary">{selectedLog.referenceCode}</span>
                </div>
              </div>

              {/* Before vs After Diff Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="font-bold text-muted-foreground block">
                    Before Data (JSONB):
                  </span>
                  <pre className="p-3 rounded-xl bg-black/60 border border-border text-[11px] font-mono text-zinc-300 overflow-x-auto min-h-[100px]">
                    {JSON.stringify(selectedLog.beforeData || {}, null, 2)}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-emerald-400 block">
                    After Data (JSONB):
                  </span>
                  <pre className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 overflow-x-auto min-h-[100px]">
                    {JSON.stringify(selectedLog.afterData || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Tutup Rincian
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
