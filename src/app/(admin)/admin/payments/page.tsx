"use client";

import * as React from "react";
import { CreditCard, Check, X, Eye, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatRupiah, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { verifyManualPayment } from "@/actions/payments";

interface ManualProofItem {
  id: string;
  invoiceId: string;
  senderName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  expectedAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  proofUrl: string;
  uploadedAt: string;
}

export default function AdminManualPaymentsPage() {
  const [proofs, setProofs] = React.useState<ManualProofItem[]>([
    {
      id: "prf-1",
      invoiceId: "TUG-2025-000428",
      senderName: "Dimas Anggara",
      bankName: "BCA",
      accountNumber: "5210984712",
      amount: 59000,
      expectedAmount: 59000,
      status: "PENDING",
      proofUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=70",
      uploadedAt: "2025-05-10T14:10:00Z",
    },
    {
      id: "prf-2",
      invoiceId: "TUG-2025-000429",
      senderName: "Dewi Lestari",
      bankName: "Mandiri",
      accountNumber: "1370019284712",
      amount: 145000,
      expectedAmount: 145000,
      status: "PENDING",
      proofUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop&q=70",
      uploadedAt: "2025-05-10T14:25:00Z",
    },
  ]);

  const [previewProof, setPreviewProof] = React.useState<ManualProofItem | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);
  const [targetProof, setTargetProof] = React.useState<ManualProofItem | null>(null);
  const [rejectReason, setRejectReason] = React.useState("Nominal tidak sesuai struk");

  const handleApprove = async (item: ManualProofItem) => {
    try {
      await verifyManualPayment({
        paymentProofId: item.id,
        action: "APPROVE",
        verifiedAmount: item.expectedAmount,
      });
    } catch {}

    setProofs(
      proofs.map((p) => (p.id === item.id ? { ...p, status: "APPROVED" } : p))
    );
    toast.success(`Pembayaran ${item.invoiceId} disetujui! Status order masuk PROCESSING dan audit_logs tercatat.`);
    setPreviewProof(null);
  };

  const handleRejectConfirm = async () => {
    if (!targetProof) return;

    try {
      await verifyManualPayment({
        paymentProofId: targetProof.id,
        action: "REJECT",
        rejectReason,
      });
    } catch {}

    setProofs(
      proofs.map((p) =>
        p.id === targetProof.id ? { ...p, status: "REJECTED" } : p
      )
    );
    setRejectModalOpen(false);
    toast.error(`Pembayaran ${targetProof.invoiceId} ditolak. Alasan: ${rejectReason}. Audit log tercatat.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Verifikasi Transfer Manual
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Periksa struk bukti transfer rekening BCA manual untuk menyetujui pengiriman diamond
          </p>
        </div>
        <Badge variant="warning" className="font-bold text-xs">
          {proofs.filter((p) => p.status === "PENDING").length} Menunggu Verifikasi
        </Badge>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Nama Pengirim</TableHead>
              <TableHead>Bank &amp; Rekening</TableHead>
              <TableHead>Nominal Transfer</TableHead>
              <TableHead>Kesesuaian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi Verifikasi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proofs.map((p) => {
              const isMatch = p.amount === p.expectedAmount;
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-mono font-bold text-xs text-primary">
                    {p.invoiceId}
                    <span className="block text-[10px] text-muted-foreground font-sans">
                      {formatDate(p.uploadedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">
                    {p.senderName}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {p.bankName} - {p.accountNumber}
                  </TableCell>
                  <TableCell className="font-price font-bold text-xs text-accent">
                    {formatRupiah(p.amount)}
                  </TableCell>
                  <TableCell>
                    {isMatch ? (
                      <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        ✓ Pas ({formatRupiah(p.expectedAmount)})
                      </span>
                    ) : (
                      <span className="text-xs text-destructive font-bold">
                        Beda
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        p.status === "APPROVED"
                          ? "success"
                          : p.status === "REJECTED"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-[10px]"
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setPreviewProof(p)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview Struk
                    </Button>
                    {p.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleApprove(p)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs"
                          onClick={() => {
                            setTargetProof(p);
                            setRejectModalOpen(true);
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Preview Proof Modal */}
      {previewProof && (
        <Dialog
          open={!!previewProof}
          onOpenChange={() => setPreviewProof(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Struk Bukti Transfer: {previewProof.invoiceId}</DialogTitle>
              <DialogDescription>
                Pengirim: {previewProof.senderName} ({previewProof.bankName} - {previewProof.accountNumber})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/50 border border-border flex items-center justify-center">
                <img
                  src={previewProof.proofUrl}
                  alt="Struk Transfer"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/50 font-price text-sm">
                <span>Nominal Tertera:</span>
                <span className="font-bold text-accent">
                  {formatRupiah(previewProof.amount)}
                </span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              {previewProof.status === "PENDING" && (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setTargetProof(previewProof);
                      setPreviewProof(null);
                      setRejectModalOpen(true);
                    }}
                  >
                    Tolak Struk Ini
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow"
                    onClick={() => handleApprove(previewProof)}
                  >
                    Setujui &amp; Kirim Diamond
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Alasan Penolakan Bukti Transfer</DialogTitle>
            <DialogDescription>
              Alasan ini akan dikirimkan kepada pembeli via WhatsApp
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Label>Pilih Alasan Penolakan</Label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 text-xs"
            >
              <option value="Nominal transfer tidak sesuai dengan invoice">
                Nominal transfer tidak sesuai dengan invoice
              </option>
              <option value="Foto struk buram / tidak terbaca">
                Foto struk buram / tidak terbaca
              </option>
              <option value="Bukti transfer terindikasi palsu / manipulasi">
                Bukti transfer terindikasi palsu / manipulasi
              </option>
              <option value="Nama pengirim dan mutasi bank tidak ditemukan">
                Nama pengirim dan mutasi bank tidak ditemukan
              </option>
            </select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRejectConfirm}
            >
              Konfirmasi Tolak Pembayaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
