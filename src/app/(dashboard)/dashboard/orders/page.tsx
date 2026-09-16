"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, Filter, ArrowUpDown, ChevronRight } from "lucide-react";
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
import { DUMMY_TOPUP_ORDERS } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function UserOrdersPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const filteredOrders = DUMMY_TOPUP_ORDERS.filter((ord) => {
    const matchSearch =
      ord.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      ord.gameName.toLowerCase().includes(search.toLowerCase()) ||
      ord.productLabel.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "ALL" || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Riwayat Pesanan Top-Up
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar seluruh transaksi pembelian diamond dan voucher game Anda
          </p>
        </div>
        <Button asChild size="sm" className="shadow-glow">
          <Link href="/top-up">Top-Up Baru</Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari Invoice atau Nama Game..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { key: "ALL", label: "Semua Status" },
            { key: "SUCCESS", label: "Sukses" },
            { key: "PROCESSING", label: "Diproses" },
            { key: "PENDING_PAYMENT", label: "Pending" },
            { key: "EXPIRED", label: "Kadaluarsa" },
          ].map((item) => (
            <Button
              key={item.key}
              variant={statusFilter === item.key ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs rounded-lg"
              onClick={() => setStatusFilter(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Invoice</TableHead>
              <TableHead>Game &amp; Item</TableHead>
              <TableHead>Tujuan Akun</TableHead>
              <TableHead>Metode Bayar</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((ord) => (
              <TableRow key={ord.id}>
                <TableCell className="font-mono font-bold text-xs text-primary">
                  {ord.invoiceId}
                  <span className="block font-sans font-normal text-[10px] text-muted-foreground">
                    {formatDate(ord.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-xs block text-foreground">
                    {ord.gameName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {ord.productLabel}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {ord.gameUserId} {ord.gameZoneId ? `(${ord.gameZoneId})` : ""}
                </TableCell>
                <TableCell className="text-xs">
                  {ord.paymentMethodLabel || ord.paymentMethod}
                </TableCell>
                <TableCell className="font-price font-bold text-xs text-accent">
                  {formatRupiah(ord.total)}
                </TableCell>
                <TableCell>
                  {ord.status === "SUCCESS" ? (
                    <Badge variant="success" className="text-[10px]">
                      SUKSES
                    </Badge>
                  ) : ord.status === "PROCESSING" ? (
                    <Badge variant="accent" className="text-[10px]">
                      DIPROSES
                    </Badge>
                  ) : ord.status === "PENDING_PAYMENT" ? (
                    <Badge variant="warning" className="text-[10px]">
                      PENDING
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">
                      {ord.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                    <Link href={`/dashboard/orders/${ord.id}`}>Detail</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-xs text-muted-foreground">
            Tidak ada transaksi top-up yang sesuai dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}
