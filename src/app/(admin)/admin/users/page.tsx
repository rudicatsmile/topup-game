"use client";

import * as React from "react";
import { Users, Search, Ban, CheckCircle, ShieldAlert, UserCheck } from "lucide-react";
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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState([
    {
      id: "u-1",
      name: "Rizky Aditya Pratama",
      email: "rizky.aditya@example.com",
      phoneWa: "0812-3456-7890",
      role: "user",
      points: 1250,
      isBanned: false,
      createdAt: "2024-03-12T10:00:00Z",
    },
    {
      id: "u-joki-1",
      name: 'Andika "ViperML"',
      email: "andika.viper@topupgame.id",
      phoneWa: "0813-9876-5432",
      role: "joki",
      points: 4800,
      isBanned: false,
      createdAt: "2024-01-15T08:00:00Z",
    },
    {
      id: "u-admin-1",
      name: "Dwi Kartika Sari",
      email: "owner@topupgame.id",
      phoneWa: "0811-2233-4455",
      role: "super_admin",
      points: 0,
      isBanned: false,
      createdAt: "2023-11-01T00:00:00Z",
    },
    {
      id: "u-banned-1",
      name: "Abuser Fake Proof",
      email: "spammer@disposable.com",
      phoneWa: "0899-0011-2233",
      role: "user",
      points: 0,
      isBanned: true,
      createdAt: "2025-05-01T12:00:00Z",
    },
  ]);

  const [search, setSearch] = React.useState("");

  const handleToggleBan = (id: string, name: string, isBanned: boolean) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, isBanned: !isBanned } : u))
    );
    if (isBanned) {
      toast.success(`Akun "${name}" berhasil diaktifkan kembali. Dicatat ke audit_logs.`);
    } else {
      toast.error(`Akun "${name}" berhasil diblokir (banned). Dicatat ke audit_logs.`);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phoneWa.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Kelola Pengguna Sistem
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar seluruh akun member, worker joki, dan administrator platform
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, nomor WA..."
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
              <TableHead>Nama Pengguna</TableHead>
              <TableHead>Email Akun</TableHead>
              <TableHead>Nomor WhatsApp</TableHead>
              <TableHead>Role Hak Akses</TableHead>
              <TableHead>Poin Reward</TableHead>
              <TableHead>Status Akun</TableHead>
              <TableHead>Terdaftar</TableHead>
              <TableHead className="text-right">Aksi Moderasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-bold text-xs">
                  {u.name}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {u.email}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  {u.phoneWa}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      u.role === "super_admin"
                        ? "default"
                        : u.role === "joki"
                        ? "accent"
                        : "outline"
                    }
                    className="text-[10px] uppercase font-bold"
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-primary font-bold">
                  {u.points}
                </TableCell>
                <TableCell>
                  {u.isBanned ? (
                    <Badge variant="destructive" className="text-[10px]">
                      BANNED
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-[10px]">
                      AKTIF
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(u.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {u.role !== "super_admin" && (
                    <Button
                      size="sm"
                      variant={u.isBanned ? "outline" : "destructive"}
                      className="h-7 text-xs"
                      onClick={() => handleToggleBan(u.id, u.name, u.isBanned)}
                    >
                      {u.isBanned ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" /> Unban
                        </>
                      ) : (
                        <>
                          <Ban className="h-3 w-3 mr-1" /> Ban Akun
                        </>
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
