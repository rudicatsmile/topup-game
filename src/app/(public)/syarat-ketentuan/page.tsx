import Link from "next/link";
import { ShieldCheck, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SyaratKetentuanPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-8">
      <div className="space-y-3">
        <Badge variant="gaming" className="font-bold">
          LEGALITAS &amp; KEBIJAKAN
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Syarat &amp; Ketentuan Layanan
        </h1>
        <p className="text-xs text-muted-foreground">
          Terakhir diperbarui: 1 Mei 2025 • Berlaku untuk seluruh pengguna situs TopUpGame
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground font-heading">
            1. Ketentuan Umum
          </h2>
          <p>
            Dengan mengakses dan melakukan pemesanan di situs TopUpGame (selanjutnya disebut "Kami"), Anda menyetujui untuk terikat secara hukum pada Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu poin, harap tidak melanjutkan penggunaan layanan.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground font-heading">
            2. Layanan Top-Up Game Otomatis
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pengguna wajib memasukkan User ID dan Zone ID (jika relevan) secara cermat. Kami tidak bertanggung jawab atas kesalahan pengiriman akibat kelalaian input ID pengguna.</li>
            <li>Setelah pembayaran terkonfirmasi oleh sistem, pengiriman diamond/voucher diproses otomatis dalam 60 detik hingga maksimal 10 menit jika terjadi antrean server supplier.</li>
            <li>Jika pesanan mengalami status kegagalan pengiriman dari pihak penyedia resmi game, pengguna berhak menerima pengembalian dana (refund) penuh.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground font-heading">
            3. Layanan Joki Rank
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Data akun yang dimasukkan oleh pengguna dienkripsi dengan standar AES-256-GCM dan hanya dibuka oleh mitra joki yang ditugaskan secara resmi.</li>
            <li>Pengguna dilarang melakukan login (menabrak sesi permainan) saat proses joki sedang berlangsung tanpa koordinasi terlebih dahulu melalui fitur Chat Joki.</li>
            <li>Mitra joki dilarang keras menggunakan program ilegal (cheat, script, atau mod). Pelanggaran terhadap poin ini menjamin penggantian akun atau kompensasi 100%.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground font-heading">
            4. Pembayaran &amp; Pembatalan
          </h2>
          <p>
            Semua pembayaran diproses melalui saluran resmi yang tertera (Xendit QRIS, Virtual Account, E-Wallet, atau Transfer Manual Rekening Resmi PT TopUpGame Indonesia). Transaksi yang telah dibayar dan dalam status diproses tidak dapat dibatalkan secara sepihak oleh pengguna.
          </p>
        </section>
      </div>
    </div>
  );
}
