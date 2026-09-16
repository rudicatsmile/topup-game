import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function KebijakanPrivasiPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-8">
      <div className="space-y-3">
        <Badge variant="accent" className="font-bold">
          PERLINDUNGAN DATA PENGGUNA
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
          Kebijakan Privasi
        </h1>
        <p className="text-xs text-muted-foreground">
          Terakhir diperbarui: 1 Mei 2025 • PT TopUpGame Indonesia
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground font-heading">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Kami mengumpulkan data yang diperlukan untuk memproses transaksi Anda secara akurat, meliputi:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>User ID &amp; Zone ID Game yang dituju.</li>
            <li>Nomor WhatsApp aktif untuk penyampaian bukti dan update transaksi secara berkala.</li>
            <li>Alamat email untuk pembuatan akun member, invoice digital, dan reset password.</li>
            <li>Untuk pesanan Joki Rank: Kredensial login akun game yang langsung dienkripsi secara simetris AES-256-GCM pada saat submit formulir.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground font-heading">
            2. Keamanan &amp; Enkripsi Data Kredensial
          </h2>
          <p>
            Kerahasiaan akun game Anda adalah prioritas absolut kami. Kredensial tidak pernah disimpan dalam format teks biasa (plain text). Setiap pembacaan data akun oleh joki yang ditugaskan akan otomatis dicatat secara permanen di dalam sistem <em>Audit Log</em> immutable kami.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground font-heading">
            3. Penggunaan Cookie &amp; Pihak Ketiga
          </h2>
          <p>
            Kami menggunakan cookie teknis semata-mata untuk mengelola sesi login dan preferensi tema tampilan (gelap/terang). Kami tidak pernah menjual atau membagikan data pribadi pelanggan kepada pihak pengiklan mana pun.
          </p>
        </section>
      </div>
    </div>
  );
}
