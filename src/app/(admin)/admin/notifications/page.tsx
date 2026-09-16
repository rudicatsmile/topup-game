"use client";

import * as React from "react";
import { MessageSquare, Edit, Send, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminWhatsAppGatewayPage() {
  const [templates, setTemplates] = React.useState([
    {
      id: "tpl-1",
      code: "ORDER_PAID",
      name: "Pembayaran Diterima",
      body: "Halo {{nama}}, pembayaran untuk pesanan {{invoice}} telah kami terima sebesar {{total}}. Pesanan sedang kami kirimkan!",
    },
    {
      id: "tpl-2",
      code: "TOPUP_SUCCESS",
      name: "Diamond Berhasil Masuk",
      body: "Kabar gembira {{nama}}! Diamond {{game}} Anda pada invoice {{invoice}} telah sukses dikirim ke akun Anda. Cek sekarang: {{link}}",
    },
    {
      id: "tpl-3",
      code: "JOKI_PROGRESS",
      name: "Update Progres Joki Rank",
      body: "Halo {{nama}}, joki {{worker}} baru saja update progres untuk order {{invoice}}. Posisi terkini: {{rank_terkini}}. Pantau di {{link}}",
    },
  ]);

  const [logs, setLogs] = React.useState([
    {
      id: "wl-1",
      phone: "081234567890",
      recipient: "Rizky Aditya",
      templateCode: "TOPUP_SUCCESS",
      status: "SENT",
      createdAt: "2025-05-10T14:02:18Z",
    },
    {
      id: "wl-2",
      phone: "081234567890",
      recipient: "Rizky Aditya",
      templateCode: "JOKI_PROGRESS",
      status: "SENT",
      createdAt: "2025-05-10T13:45:05Z",
    },
    {
      id: "wl-3",
      phone: "081398765432",
      recipient: "Dimas Anggara",
      templateCode: "ORDER_PAID",
      status: "SENT",
      createdAt: "2025-05-09T20:15:30Z",
    },
  ]);

  const [editTpl, setEditTpl] = React.useState<any>(null);
  const [tplBody, setTplBody] = React.useState("");

  const handleOpenEdit = (t: any) => {
    setEditTpl(t);
    setTplBody(t.body);
  };

  const handleSaveTpl = () => {
    setTemplates(
      templates.map((t) => (t.id === editTpl.id ? { ...t, body: tplBody } : t))
    );
    setEditTpl(null);
    toast.success("Template notifikasi WhatsApp berhasil diperbarui!");
  };

  const handleTestBroadcast = () => {
    toast.success("Tes kirim pesan WhatsApp berhasil terkirim via provider Fonnte (Status: 200 OK)!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            WhatsApp Gateway &amp; Template Pesan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola koneksi Fonnte/Wablas, template pesan otomatis, dan log pengiriman
          </p>
        </div>

        <Button onClick={handleTestBroadcast} size="sm" variant="outline">
          <Send className="h-4 w-4 mr-1.5" />
          Kirim Tes WhatsApp
        </Button>
      </div>

      {/* Gateway Status Box */}
      <Card className="rounded-2xl border-emerald-500/30 bg-emerald-500/5 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-foreground">
                  Fonnte WhatsApp Provider: Terhubung
                </h4>
                <Badge variant="success" className="text-[10px]">
                  ONLINE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Sender: +62 812-3456-7890 • Kuota Tersedia: 4.850 Pesan
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Templates List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-sm">Template Pesan Otomatis Transaksional</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Event</TableHead>
              <TableHead>Nama Template</TableHead>
              <TableHead>Isi Pesan (Variabel)</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono font-bold text-xs text-primary">
                  {t.code}
                </TableCell>
                <TableCell className="text-xs font-semibold">
                  {t.name}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                  {t.body}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => handleOpenEdit(t)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit Template
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-sm">Log Pengiriman WhatsApp Terakhir</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Penerima</TableHead>
              <TableHead>Nomor WhatsApp</TableHead>
              <TableHead>Template Terkirim</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Waktu Pengiriman</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-xs font-bold">{l.recipient}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {l.phone}
                </TableCell>
                <TableCell className="font-mono text-xs text-accent font-semibold">
                  {l.templateCode}
                </TableCell>
                <TableCell>
                  <Badge variant="success" className="text-[10px]">
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {formatDate(l.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Template Modal */}
      {editTpl && (
        <Dialog open={!!editTpl} onOpenChange={() => setEditTpl(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Template: {editTpl.code}</DialogTitle>
              <DialogDescription>
                Gunakan placeholder variabel: {"{{nama}}"}, {"{{invoice}}"}, {"{{game}}"}, {"{{total}}"}, {"{{link}}"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <Label>Isi Pesan WhatsApp</Label>
              <Textarea
                rows={5}
                value={tplBody}
                onChange={(e) => setTplBody(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditTpl(null)}>
                Batal
              </Button>
              <Button onClick={handleSaveTpl} className="shadow-glow">
                Simpan Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
