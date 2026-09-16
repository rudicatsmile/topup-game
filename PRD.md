# TopUpGame

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: TopUpGame — Platform Top-Up Diamond Game & Joki Rank #1 di Indonesia
- **Penjelasan Singkat**: TopUpGame adalah platform digital yang memungkinkan gamer melakukan top-up diamond/voucher game favorit (Mobile Legends, Free Fire, PUBG Mobile, Valorant, Genshin Impact, dll.) secara instan dengan pembayaran QRIS/e-wallet/bank, sekaligus menyediakan layanan joki rank termurah yang dikelola secara online lengkap dengan tracking status dan chat dengan joki secara realtime.
- **Masalah yang Diselesaikan**:
  - Proses top-up manual via reseller sering lambat, tidak transparan, dan rawan penipuan.
  - Harga diamond antar toko tidak konsisten dan sulit membandingkan secara real-time.
  - Layanan joki rank umumnya ilegal-feel, tidak ada tracking, tidak ada invoice resmi, dan tidak ada audit transaksi.
  - Admin merchant kesulitan mengelola stok, harga, margin, dan rekonsiliasi pembayaran dari banyak channel.
- **Pengguna Aplikasi**:
  - **Pembeli / Gamer**: Top-up diamond & order joki rank, pantau status, chat dengan joki, dan bayar via beragam metode.
  - **Joki / Worker**: Menerima order joki, update progress rank, upload bukti, dan berkomunikasi dengan pembeli.
  - **Admin / Owner**: Kelola produk, harga, voucher, order, keuangan, dan supplier.
  - **Super Admin**: Akses penuh termasuk audit log, konfigurasi sistem, dan manajemen user internal.
- **Target Keberhasilan**:
  - Rata-rata pemrosesan top-up otomatis < 60 detik dari pembayaran terkonfirmasi sampai diamond masuk.
  - Minimal 1.000 transaksi sukses per bulan dalam 3 bulan pertama dengan success rate pembayaran > 95%.
  - Rating kepuasan pengguna rata-rata ≥ 4,7/5,0 dan repeat order rate ≥ 40%.
  - Waktu respons admin terhadap order joki dan bukti transfer manual < 10 menit (jam kerja).
  - Zero data loss pada order & payment terbukti lewat audit log 100% perubahan tercatat.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak (mencegah scope creep).*
### ✅ Yang Dikerjakan:
- Landing page modern + katalog kategori game (ML, FF, PUBG, Valorant, Genshin, dll.).
- Alur top-up otomatis: pilih nominal → checkout → bayar (Xendit + Transfer Manual) → proses otomatis via supplier API/webhook.
- Alur layanan joki rank lengkap: form order (Game, Rank Awal & Tujuan, Login Akun), estimasi harga & durasi otomatis, tracking status realtime, riwayat & invoice, upload bukti, dan chat joki.
- Autentikasi Email & Password (verifikasi email + reset password).
- Dashboard User: riwayat transaksi top-up & joki, profil, saldo/poin.
- Dashboard Admin: kelola produk & nominal diamond, pengaturan harga & margin, voucher promo, kelola order top-up & joki, laporan penjualan, kelola stok & sinkronisasi supplier.
- Integrasi Xendit (QRIS, VA Bank, E-Wallet Dana/OVO/GoPay, Retail Outlet) + Transfer Manual (upload bukti).
- Notifikasi WhatsApp Gateway (Fonnte/Wablas/Meta WhatsApp Cloud API) untuk status order & pembayaran.
- Audit log lengkap untuk setiap perubahan order, pembayaran, harga, dan stok.
- Dark mode friendly + responsive mobile-first di Web.
- Aplikasi Mobile React Native (Expo) dengan fitur inti: katalog, top-up, order joki, tracking, chat, notifikasi.

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Fitur marketplace multi-seller (hanya single-owner store).
- Fitur live streaming/tournament game.
- Fitur loyalty multi-tier rumit (hanya poin dasar & voucher).
- Fitur split payment & cicilan (PayLater).
- Integrasi API resmi langsung ke publisher game (menggunakan supplier aggregator dulu).
- Fitur laporan pajak otomatis / e-Faktur.
- Fitur AI chatbot rekomendasi game.

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna (Role).*
### A. Public Area (Tanpa Login)
- `/` (Beranda): Hero banner promo, kategori game, flash sale, produk terlaris, testimoni, dan CTA top-up/joki.
- `/top-up` (Katalog Top-Up): Daftar seluruh game dengan grid kategori, search bar, filter platform (Mobile/PC), dan urutan popularitas.
- `/top-up/[slug]` (Detail Game Top-Up): Pilih nominal diamond, input User ID + Zone ID, preview harga, dan form checkout cepat.
- `/joki` (Landing Joki Rank): Daftar game yang menyediakan joki, kalkulator estimasi harga & durasi, dan alur layanan.
- `/joki/[slug]` (Detail Joki Game): Form order joki (Rank Awal, Rank Tujuan, Login Akun, Catatan), estimasi otomatis, dan CTA order.
- `/promo` (Voucher & Promo): Daftar voucher aktif, syarat & ketentuan, dan kode salin cepat.
- `/blog` (Blog/Artikel): Artikel tips & berita game (SEO-driven).
- `/blog/[slug]` (Detail Artikel): Konten artikel, share sosmed, dan rekomendasi produk terkait.
- `/tentang` (Tentang Kami): Cerita TopUpGame, visi, dan tim.
- `/kontak` (Hubungi Kami): Form kontak + WhatsApp langsung + email.
- `/faq` (Pusat Bantuan): Akordeon pertanyaan umum kategori Pembayaran, Top-Up, dan Joki.
- `/syarat-ketentuan` (S&K): Kebijakan penggunaan layanan.
- `/kebijakan-privasi` (Privacy Policy): Kebijakan data pengguna.
- `/lacak` (Lacak Pesanan Publik): Input Invoice ID untuk cek status tanpa login (rate-limited).
- `/login` (Masuk): Form login Email & Password.
- `/register` (Daftar): Form registrasi + konfirmasi verifikasi email.
- `/forgot-password` (Lupa Password): Form kirim tautan reset.
- `/reset-password` (Reset Password): Form password baru via token email.

### B. Member/User Area (Setelah Login)
- `/dashboard` (Dasbor User): Ringkasan saldo poin, order aktif, riwayat terakhir, dan shortcut cepat.
- `/dashboard/topup` (Top-Up Baru): Shortcut ke katalog dan transaksi terakhir.
- `/dashboard/orders` (Riwayat Order Top-Up): List order dengan filter status, search, dan pagination.
- `/dashboard/orders/[id]` (Detail Order Top-Up): Status realtime, invoice, dan tombol bantuan.
- `/dashboard/joki` (Riwayat Order Joki): List order joki dengan progress bar rank.
- `/dashboard/joki/[id]` (Detail Order Joki): Progress rank, durasi, chat dengan joki, upload bukti.
- `/dashboard/invoice/[id]` (Invoice): Tampilan invoice siap cetak / PDF.
- `/dashboard/chat` (Chat Center): Semua percakapan dengan joki & admin.
- `/dashboard/profile` (Profil): Edit nama, foto, nomor WhatsApp, dan password.
- `/dashboard/vouchers` (Voucher Saya): Voucher aktif & yang sudah terpakai.
- `/dashboard/notifications` (Notifikasi): Semua notifikasi in-app & riwayat WhatsApp.

### C. Joki/Worker Area (Setelah Login sebagai Joki)
- `/joki-panel` (Dasbor Joki): Order joki yang ditugaskan & performance.
- `/joki-panel/orders` (Order Aktif): List order dengan tombol update progress.
- `/joki-panel/orders/[id]` (Detail & Update): Update rank, upload screenshot, chat dengan pembeli.
- `/joki-panel/earnings` (Pendapatan Joki): Rekap komisi & pencairan.

### D. Admin Area (Setelah Login sebagai Admin/Super Admin)
- `/admin` (Dasbor Admin): KPI harian (revenue, order, conversion), grafik penjualan, dan alert stok.
- `/admin/games` (Kelola Game): CRUD game + upload logo + status aktif/nonaktif.
- `/admin/products` (Kelola Produk & Nominal Diamond): CRUD paket nominal per game, harga modal, harga jual, margin, stok.
- `/admin/pricing` (Pengaturan Harga & Margin): Aturan markup global per kategori, aturan dinamis jam sibuk.
- `/admin/vouchers` (Kelola Voucher Promo): CRUD voucher, batas kuota, tanggal berlaku, dan usage tracking.
- `/admin/orders/topup` (Kelola Order Top-Up): List, filter status, verifikasi manual, dan retry proses.
- `/admin/orders/joki` (Kelola Order Joki): List, assign joki, verifikasi pembayaran, dan selesaikan order.
- `/admin/payments` (Verifikasi Transfer Manual): Antrean bukti transfer & approve/reject manual.
- `/admin/suppliers` (Kelola Supplier & Sinkronisasi): CRUD supplier, API key, mapping produk, dan sinkronisasi stok.
- `/admin/stock` (Kelola Stok): Riwayat perubahan stok, alert stok kritis, dan stok opname.
- `/admin/reports` (Laporan Penjualan): Laporan harian/bulanan, rekap keuangan, ekspor CSV/Excel.
- `/admin/users` (Kelola User): List user, cari, banned, dan impersonate.
- `/admin/joki` (Kelola Joki/Worker): CRUD joki, komisi, dan performa.
- `/admin/notifications` (WhatsApp Gateway): Template pesan, log pengiriman, dan retry.
- `/admin/audit-logs` (Audit Log): Log semua perubahan order, payment, harga, stok, dan user admin dengan filter aktor/entity.
- `/admin/settings` (Pengaturan Sistem): Konfigurasi umum, payment, dan kontak.

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*
- **Skema Warna**:
  - Primary: `HSL(258, 90%, 60%)` (ungu elektrik ala gaming, dominan di CTA & brand).
  - Primary Foreground: `HSL(0, 0%, 100%)`.
  - Accent: `HSL(190, 95%, 50%)` (cyan neon untuk highlight angka/harga).
  - Secondary: `HSL(258, 40%, 96%)`.
  - Success: `HSL(150, 70%, 42%)` (status sukses order).
  - Warning: `HSL(38, 92%, 55%)` (pending & verifikasi manual).
  - Destructive: `HSL(0, 84%, 60%)` (gagal/refund).
  - Background Light: `HSL(0, 0%, 100%)`, Foreground: `HSL(240, 10%, 10%)`.
  - Background Dark: `HSL(240, 12%, 8%)`, Foreground: `HSL(0, 0%, 96%)`, Card Dark: `HSL(240, 10%, 12%)`.
  - Border: `HSL(240, 6%, 90%)` light / `HSL(240, 8%, 20%)` dark.
- **Tipografi**:
  - Heading & Brand: `Plus Jakarta Sans` (bold 700, tracking tight).
  - Body: `Inter` (regular 400/500).
  - Numeric/Harga: `JetBrains Mono` (agar angka harga rapi dan tidak bergeser saat live update).
- **Aturan Komponen**:
  - Radius default: `rounded-xl` (12px), kartu besar `rounded-2xl` (16px), tombol utama `rounded-lg` (10px).
  - Shadow: `shadow-sm` untuk kartu biasa, `shadow-lg` + `ring-primary/20` saat hover, dan `shadow-glow` (primary blur) pada tombol CTA utama.
  - Semua tabel pakai `shadcn/ui DataTable` dengan sticky header, zebra stripes, dan filter set kolom.
  - Semua form memakai `react-hook-form` + `zod` + `shadcn/ui Form` dengan pesan error warna destructive.
  - Semua modal pakai `shadcn/ui Dialog` di desktop dan `Drawer` (bottom sheet) di mobile.
- **Nuansa & Vibe**:
  - Vibe “Neo-gaming premium”: clean, modern, banyak whitespace, gradient halus di hero, dan micro-animations.
  - Transisi halus (durasi 200–300ms, easing `ease-out`), hover lift pada kartu produk.
  - Angka harga live-update pakai animasi count-up (Framer Motion).
  - Dark mode sebagai first-class citizen (toggle persisted di `localStorage` + `prefers-color-scheme`).
  - Skeleton loading di setiap list/kartu agar tidak pernah ada blank state.
  - Empty state ilustratif (SVG custom) dengan CTA jelas, bukan placeholder generik.

---

## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*
| Menu / Halaman | Publik (Tanpa Login) | User (Login) | Joki (Worker) | Admin | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Beranda & Katalog `/` `/top-up` `/joki` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Detail Produk `/top-up/[slug]` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkout & Bayar | ❌ | ✅ | ✅ | ✅ | ✅ |
| Lacak Pesanan Publik `/lacak` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dasbor User `/dashboard` | ❌ | ✅ | ❌ | ❌ | ✅ |
| Riwayat Order `/dashboard/orders` | ❌ | ✅ | ❌ | ❌ | ✅ |
| Order Joki User `/dashboard/joki` | ❌ | ✅ | ❌ | ❌ | ✅ |
| Chat dengan Joki | ❌ | ✅ | ✅ | ✅ | ✅ |
| Panel Joki `/joki-panel` | ❌ | ❌ | ✅ | ❌ | ✅ |
| Kelola Game & Produk `/admin/games` `/admin/products` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Pengaturan Harga & Margin `/admin/pricing` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kelola Voucher `/admin/vouchers` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kelola Order Top-Up `/admin/orders/topup` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kelola Order Joki `/admin/orders/joki` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Verifikasi Transfer Manual `/admin/payments` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kelola Supplier & Sinkronisasi `/admin/suppliers` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kelola Stok `/admin/stock` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Laporan & Rekap Keuangan `/admin/reports` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Kelola User `/admin/users` | ❌ | ❌ | ❌ | ❌ | ✅ |
| Audit Log `/admin/audit-logs` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Pengaturan Sistem `/admin/settings` | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Registrasi & Login Email/Password
1. **Cara Kerja**: Pengguna membuka `/register`, mengisi nama, email, nomor WhatsApp, dan password → sistem mengirim email verifikasi → setelah verifikasi, pengguna otomatis login dan diarahkan ke `/dashboard`. Login berikutnya memakai `/login` dengan email & password.
2. **Aturan Sistem**:
   - Password minimal 8 karakter, wajib mengandung huruf besar, huruf kecil, dan angka.
   - Email wajib unik, divalidasi format + verifikasi wajib sebelum bisa transaksi.
   - Nomor WhatsApp wajib format Indonesia (`+62` / `08xx`) karena dipakai untuk notifikasi.
   - Rate limit login: 5 percobaan gagal / 15 menit / IP.
   - Reset password via tautan email dengan token expire 30 menit.

### B. Top-Up Diamond Otomatis
1. **Cara Kerja**: Pengguna pilih game di `/top-up` → pilih nominal di `/top-up/[slug]` → input User ID + Zone ID (opsional sesuai game) → pilih metode bayar (Xendit atau Transfer Manual) → sistem membuat order dengan status `PENDING_PAYMENT` → setelah bayar:
   - **Xendit**: webhook `/api/webhooks/xendit` menerima status `PAID` → sistem meneruskan ke supplier API → status order jadi `PROCESSING` → setelah supplier sukses, status jadi `SUCCESS` dan notifikasi WhatsApp dikirim.
   - **Transfer Manual**: pengguna upload bukti di `/dashboard/orders/[id]` → admin verifikasi di `/admin/payments` → order masuk `PROCESSING` → lanjut seperti di atas.
2. **Aturan Sistem**:
   - Order expired otomatis dalam 30 menit jika belum dibayar (status `EXPIRED`).
   - Nominal produk memiliki stok (`stock > 0`); jika stok habis tampil disabled.
   - Maksimal 5 order pending per user untuk mencegah abuse.
   - Setiap perubahan status wajib menulis baris `audit_logs` (`entity_type = 'order_topup'`).
   - Retry otomatis ke supplier maksimal 3x dengan exponential backoff; jika gagal → status `FAILED` dan refund otomatis dikirim notifikasi.

### C. Layanan Joki Rank
1. **Cara Kerja**: Pengguna buka `/joki/[slug]` → pilih Game, Rank Awal, Rank Tujuan → isi Login Akun (email/username akun game + password akun game + kode backup OTP bila ada) → sistem menghitung estimasi harga & durasi → pengguna memilih joki (opsional)/auto-assign → checkout → bayar → setelah pembayaran terverifikasi, admin assign joki → joki update progress, upload screenshot, chat dengan pembeli → setelah selesai, status `COMPLETED`.
2. **Aturan Sistem**:
   - Estimasi harga = Σ (`tier_price[rank_awal → rank_tujuan]`) × (`1 + surcharge_percent`) + biaya layanan. Estimasi durasi = Σ (`estimated_hours_per_tier`) × faktor beban joki.
   - **Login Akun wajib terenkripsi (AES-256-GCM)** dan hanya bisa dibuka joki yang ditugaskan & super admin. Setiap akses di-log ke `audit_logs`.
   - Rank Tujuan wajib lebih tinggi dari Rank Awal (validasi Zod custom).
   - Auto-assign joki berdasarkan `skill_slugs` + beban order aktif.
   - Chat hanya bisa 1 aktif per order dengan rate limit 1 pesan/detik.
   - Progress update mengubah `current_rank_progress` dan menghitung ulang ETA.
   - Semua perubahan status joki wajib menulis `audit_logs` (`entity_type = 'order_joki'`).

### D. Pembayaran via Xendit & Transfer Manual
1. **Cara Kerja**: Untuk Xendit, sistem memanggil Xendit Invoice API saat checkout → pengguna diarahkan ke halaman Xendit (QRIS/VA/E-Wallet/Retail) → Xendit memanggil webhook `/api/webhooks/xendit` dengan signature ke `x-callback-token`/`x-callback-signature` → sistem verifikasi → update `payments` & `orders`. Untuk Transfer Manual, sistem menampilkan rekening tujuan + berita unik → pengguna upload bukti → admin approve.
2. **Aturan Sistem**:
   - Idempotency: webhook Xendit wajib diproses via `payment_events` yang menyimpan `external_id` unik (upsert) untuk mencegah double processing.
   - Verifikasi signature Xendit wajib valid (`x-callback-token` dibandingkan dengan `XENDIT_CALLBACK_TOKEN`).
   - Nominal harus persis sama (`amount_matched`), jika tidak → status `UNDERPAID` / `OVERPAID` dan butuh verifikasi admin.
   - Setiap update pembayaran → tulis `audit_logs` (`entity_type = 'payment'`, sebelum & sesudah).
   - Retry webhook pending maksimal 24 jam, disimpan sebagai worker cron job.

### E. Notifikasi WhatsApp Gateway
1. **Cara Kerja**: Setiap perubahan status penting (order dibuat, pembayaran terkonfirmasi, joki update, order selesai, refund) memicu job ke queue → worker mengirim pesan via WhatsApp Gateway (Fonnte/Wablas/Meta) → hasil kirim dicatat di `whatsapp_logs`.
2. **Aturan Sistem**:
   - Template per event di tabel `notifications_template` (variabel: `{{nama}}`, `{{invoice}}`, `{{status}}`, `{{link}}`).
   - Retry 3x jika gagal, jangan spam (dedupe per `order_id` + `event`).
   - User bisa opt-out notifikasi non-transaksional, tapi tidak bisa opt-out notifikasi transaksi.
   - Semua kirim/gagal masuk `audit_logs` (`entity_type = 'notification'`).

### F. Chat Joki ↔ Pembeli & Upload Bukti
1. **Cara Kerja**: Setelah order joki aktif, muncul tab chat di `/dashboard/joki/[id]` dan `/joki-panel/orders/[id]`. Pengguna dan joki bisa kirim pesan dan lampirkan gambar. Untuk transfer manual, pengguna upload bukti transfer di `/dashboard/orders/[id]`.
2. **Aturan Sistem**:
   - Attachment max 5MB, format JPG/PNG/PDF, disimpan ke object storage (Cloudflare R2/S3).
   - Chat bersifat realtime via WebSocket (Socket.IO / Supabase Realtime).
   - Semua pesan disimpan di `chat_messages` dengan `read_at`.
   - Tidak boleh menghapus pesan; edit tidak diizinkan.
   - Bukti transfer & screenshot joki disimpan dengan `sha256` untuk dedupe.

### G. Kelola Produk, Harga, Margin & Voucher
1. **Cara Kerja**: Admin buka `/admin/products` untuk CRUD paket nominal per game (nama, harga modal, harga jual, margin otomatis, stok). Di `/admin/pricing` bisa atur aturan markup global (mis. semua category "Mobile Legends" markup 12%). Di `/admin/vouchers` buat voucher diskon (persen/fixed) dengan kuota dan batas waktu.
2. **Aturan Sistem**:
   - `harga_jual` tidak boleh < `harga_modal` (validasi Zod).
   - Margin otomatis dihitung `harga_jual - harga_modal` saat save.
   - Voucher validasi: kuota belum habis, tanggal berlaku, minimum transaksi, per-user limit.
   - Perubahan harga > 5% wajib tercatat `audit_logs` (`entity_type = 'product_price'`).
   - Voucher hanya bisa dipakai 1x per order.

### H. Kelola Stok & Sinkronisasi Supplier
1. **Cara Kerja**: Admin menambahkan supplier di `/admin/suppliers` (API base URL, API key, mapping SKU) → buat job sinkronisasi terjadwal (cron tiap 5 menit) → stok produk diperbarui dari supplier → alert di dashboard jika stok < threshold.
2. **Aturan Sistem**:
   - Sinkronisasi idempotent, perbedaan stok ditulis ke `stock_logs` + `audit_logs`.
   - Jika supplier error, stok lokal tidak di-reset ke 0 (fail-safe).
   - Semua perubahan `stock` wajib ada `reason` (SYNC, REFUND, MANUAL, ORDER).
   - Stok negatif dilarang (constraint).

### I. Laporan Penjualan & Rekap Keuangan
1. **Cara Kerja**: Admin buka `/admin/reports` → pilih rentang tanggal → sistem menampilkan total revenue, total order top-up, total order joki, komisi joki, refund, dan net profit → bisa ekspor CSV/Excel/PDF.
2. **Aturan Sistem**:
   - Laporan dihitung real-time dari tabel `orders_topup`, `orders_joki`, `payments`, dan `refunds`.
   - Timezone default `Asia/Jakarta` (WIB).
   - Export dibatasi 50.000 baris per file; di luar itu dipecah.

### J. Audit Log (Wajib)
1. **Cara Kerja**: Setiap create/update/delete pada entitas kritis (order, payment, harga, stok, user admin) memicu penulisan baris di `audit_logs` yang berisi aktor, aksi, entity, sebelum-sesudah (JSON diff), IP, user agent, dan timestamp.
2. **Aturan Sistem**:
   - Audit log **immutable**: hanya `INSERT`, tidak boleh `UPDATE`/`DELETE` (diproteksi di level DB policy/trigger).
   - Field `before_data` & `after_data` disimpan sebagai `jsonb`.
   - Untuk operasi sensitif (baca login akun joki), dicatat sebagai `ACTION = 'READ_SENSITIVE'`.
   - Retensi minimal 2 tahun.

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout (`app/(public)/layout.tsx`)**: Header/Navbar sticky dengan logo TopUpGame, menu (Top-Up, Joki, Promo, Blog, Bantuan), search global, theme toggle, tombol Login/Register atau avatar user. Footer dengan sitemap, kebijakan, kontak, dan sosial media.
- **Dashboard User Layout (`app/(dashboard)/layout.tsx`)**: Sidebar kiri (fixed, collapsing) dengan menu Dasbor, Order Top-Up, Order Joki, Chat, Voucher, Profil. Header kecil atas dengan breadcrumb, notifikasi bell, dan avatar.
- **Joki Panel Layout (`app/(joki)/layout.tsx`)**: Sidebar kiri ringkas dengan Order Aktif, Pendapatan, Profil Joki dan badge “Online/Offline”.
- **Admin Layout (`app/(admin)/layout.tsx`)**: Sidebar kiri gelap dengan grup menu (Operasional, Katalog, Keuangan, Pengaturan) dan Header atas (search admin, switch environment, avatar).

### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Pengunjung] --> B[Landing /]
    B --> C{Pilih Layanan}
    C -->|Top-Up| D[/top-up Katalog Game/]
    C -->|Joki| E[/joki Landing Joki/]

    D --> D1[/top-up/slug Detail Game/]
    D1 --> D2[Input User ID + Zone ID]
    D2 --> D3[Checkout & Buat Order]

    E --> E1[/joki/slug Detail Joki/]
    E1 --> E2[Form: Rank Awal & Tujuan, Login Akun]
    E2 --> E3[Estimasi Harga & Durasi]
    E3 --> E4[Checkout & Buat Order Joki]

    D3 --> F{Pilih Metode Bayar}
    E4 --> F

    F -->|Xendit| G[Redirect Xendit Invoice]
    F -->|Transfer Manual| H[Upload Bukti Transfer]

    G --> I[Webhook Xendit Verified]
    H --> J[Admin Verifikasi Bukti /admin/payments]

    I --> K[Order PROCESSING]
    J --> K

    K --> L{Jenis Order?}
    L -->|Top-Up| M[Kirim ke Supplier API]
    L -->|Joki| N[Assign Joki & Mulai Proses]

    M --> O[Supplier Sukses?]
    O -->|Ya| P[Status SUCCESS]
    O -->|Tidak, retry x3| Q[Status FAILED + Refund]

    N --> R[Joki Update Progress & Chat]
    R --> S[User Konfirmasi Selesai]
    S --> P

    P --> T[Notifikasi WhatsApp + In-App]
    Q --> T
    T --> U[Audit Log Entry]
    U --> V[User Melihat Invoice & Riwayat /dashboard]

    V --> W{Repeat Order?}
    W -->|Ya| C
    W -->|Tidak| X[Selesai]
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*
- **SEO**:
  - Tag `<title>` dinamis per halaman (contoh: `Top Up Mobile Legends Termurah & Cepat — TopUpGame`).
  - Meta description unik per halaman, canonical URL, dan sitemap XML otomatis (`/sitemap.xml`) + `robots.txt`.
  - Open Graph & Twitter Card untuk setiap halaman produk, kategori, dan artikel.
  - Structured data JSON-LD: `Product`, `Offer`, `AggregateRating`, `BreadcrumbList`, `FAQPage`.
  - Server-Side Rendering (SSR/ISR) untuk halaman katalog agar cepat terindeks.
- **Keamanan**:
  - Password di-hash dengan `bcrypt` (cost 12) atau `argon2id`.
  - Semua mutation via Server Actions + validasi Zod sisi server.
  - CSRF protection bawaan Next.js + origin check untuk endpoint webhook (whitelist IP Xendit).
  - Sanitasi input XSS (DOMPurify untuk konten artikel), escape output.
  - Rate limiting pada endpoint sensitif (login, register, reset password, chat, webhook).
  - Credential login akun game dienkripsi AES-256-GCM dengan KMS-managed key.
  - Kolom `audit_logs` immutable (revoke UPDATE/DELETE untuk role app).
  - Header keamanan: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
  - Webhook Xendit wajib verifikasi `x-callback-token` + idempotency via `payment_events`.
- **Performa**:
  - Optimasi gambar via `next/image` dengan AVIF/WebP dan `priority` hanya di hero.
  - Caching: ISR pada halaman produk publik (`revalidate: 60`), Redis (Upstash) untuk sesi & rate limit.
  - Kode splitting per route, dynamic import untuk komponen berat (chart, editor, video).
  - Database indexing pada kolom pencarian & filter (slug, status, user_id, created_at).
  - Target Lighthouse: Performance ≥ 90 (mobile), SEO ≥ 95, Accessibility ≥ 95.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*
- **Gaya Bahasa**: Profesional, ramah, dan membumi — menggunakan “Kami” untuk TopUpGame dan “Anda” untuk pengguna. Hindari jargon teknis di copy publik (gunakan “diamond langsung masuk ke akun Anda”, bukan “order akan di-fulfill oleh supplier API”). Untuk halaman admin, gaya boleh lebih teknis dan ringkas.
- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan dengan konteks aplikasi.
  - **Contoh Game & Kategori**:
    - `Mobile Legends: Bang Bang` (Kategori: MOBA, Platform: Mobile) — Slug: `mobile-legends`.
    - `Free Fire` (Kategori: Battle Royale, Platform: Mobile) — Slug: `free-fire`.
    - `PUBG Mobile` (Kategori: Battle Royale, Platform: Mobile) — Slug: `pubg-mobile`.
    - `Valorant` (Kategori: FPS, Platform: PC) — Slug: `valorant`.
    - `Genshin Impact` (Kategori: RPG, Platform: Mobile/PC) — Slug: `genshin-impact`.
  - **Contoh Produk Nominal**:
    - ML `86 Diamond` — Harga Jual Rp 22.000, Harga Modal Rp 18.500, Stok 500.
    - ML `172 Diamond` — Rp 43.000, Modal Rp 36.500, Stok 350.
    - FF `355 Diamond` — Rp 50.000, Modal Rp 43.000, Stok 400.
    - Valorant `420 Points` — Rp 45.000, Modal Rp 38.500, Stok 200.
  - **Contoh Paket Joki Rank (ML)**:
    - Tier `Epic V → Legend V`: Harga Rp 85.000, Estimasi 6 jam.
    - Tier `Legend V → Mythic`: Harga Rp 150.000, Estimasi 12 jam.
    - Tier `Mythic 25★ → Mythic Glory`: Harga Rp 320.000, Estimasi 24 jam.
  - **Contoh User Dummy**:
    - Nama: `Rizky Aditya Pratama`, Email: `rizky.aditya@example.com`, WA: `0812-3456-7890`, Poin: 1.250.
    - Nama Admin: `Dwi Kartika Sari` (Super Admin), `Bagas Nugroho` (Admin Operasional).
    - Joki: `Andika "ViperML"`, Spesialis ML (Mythic 100★), rating 4,9/5 dari 143 order.
  - **Contoh Order**:
    - Invoice `TUG-2025-000431`: Top-Up ML 172 Diamond, status SUCCESS, via Xendit QRIS, total Rp 43.000.
    - Invoice `TUG-JKI-2025-000112`: Joki ML Legend V → Mythic, status ON_PROGRESS, joki Andika, estimasi 12 jam, total Rp 150.000.
  - **Contoh Voucher**:
    - `HEMAT20` — Diskon 20% max Rp 10.000, min transaksi Rp 30.000, kuota 500.
    - `NEWUSER5K` — Diskon Rp 5.000 untuk pengguna baru.
  - **Contoh Testimoni**:
    - “Top up ML 172 diamond jam 22.00, jam 22.01 diamond langsung masuk. Ngeri cepetnya!” — Rizky A.
    - “Joki Mythic-nya rapi, dikasih screenshot tiap naik tier. Recommended.” — Sarah P.

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*
- **Bahasa & Framework**:
  - **Web**: Next.js 15 (App Router) + TypeScript + React Server Components + Server Actions.
  - **Mobile**: React Native (Expo SDK terbaru) + Expo Router + TanStack Query, berbagi API dengan Web.
  - **Backend Runtime**: Node.js 20 LTS (Route Handlers di Next.js + cron worker via Vercel Cron / Railway).
- **Tampilan Antarmuka (UI)**: Tailwind CSS v4, shadcn/ui Component Library, Lucide Icons, Framer Motion, TanStack Table.
- **Autentikasi**: Better Auth (Email & Password) dengan verifikasi email, reset password, session cookie ber-hash, dan middleware role-based (`user`, `joki`, `admin`, `super_admin`).
- **Basis Data (Database)**: Neon PostgreSQL + Drizzle ORM + connection pooling (PgBouncer).
- **Cache & Rate Limit**: Upstash Redis.
- **Object Storage**: Cloudflare R2 (bukti transfer, screenshot joki, logo game).
- **Realtime**: Supabase Realtime / Socket.IO (untuk chat joki & update status).
- **Payment Gateway**: Xendit (Invoice, QRIS, VA, E-Wallet Dana/OVO/GoPay, Retail) + Transfer Manual (verifikasi admin).
- **Notifikasi**: WhatsApp Gateway via Fonnte/Wablas (abstraction layer kompatibel dengan Meta WhatsApp Cloud API).
- **Deployment**: Vercel (Web) + EAS Build (Mobile) + Neon (DB) + Upstash (Redis) + R2 (Storage).

### Struktur Skema Database Nyata
```typescript
// db/schema.ts — TopUpGame (Drizzle ORM, PostgreSQL)
import {
  pgTable, uuid, varchar, text, integer, boolean, timestamp,
  numeric, jsonb, pgEnum, index, uniqueIndex, primaryKey, smallint
} from "drizzle-orm/pg-core";

// ============ ENUMS ============
export const userRoleEnum       = pgEnum("user_role", ["user", "joki", "admin", "super_admin"]);
export const orderStatusEnum    = pgEnum("order_status", [
  "PENDING_PAYMENT", "PAID", "PROCESSING", "SUCCESS", "FAILED",
  "EXPIRED", "REFUNDED", "CANCELLED"
]);
export const jokiStatusEnum     = pgEnum("joki_status", [
  "PENDING_PAYMENT", "PAID", "QUEUED", "ON_PROGRESS",
  "ON_HOLD", "COMPLETED", "CANCELLED", "REFUNDED"
]);
export const paymentStatusEnum  = pgEnum("payment_status", [
  "PENDING", "PAID", "UNDERPAID", "OVERPAID", "FAILED", "REFUNDED", "EXPIRED"
]);
export const paymentMethodEnum  = pgEnum("payment_method", [
  "XENDIT_QRIS", "XENDIT_VA", "XENDIT_EWALLET", "XENDIT_RETAIL",
  "MANUAL_TRANSFER", "BALANCE"
]);
export const stockReasonEnum    = pgEnum("stock_reason", ["SYNC", "ORDER", "REFUND", "MANUAL", "OPNAME"]);
export const auditActionEnum    = pgEnum("audit_action", ["CREATE", "UPDATE", "DELETE", "READ_SENSITIVE", "LOGIN", "LOGOUT"]);

// ============ USERS & AUTH ============
export const users = pgTable("users", {
  id:             uuid("id").defaultRandom().primaryKey(),
  email:          varchar("email", { length: 255 }).notNull(),
  emailVerifiedAt:timestamp("email_verified_at", { withTimezone: true }),
  name:           varchar("name", { length: 120 }).notNull(),
  phoneWa:        varchar("phone_wa", { length: 20 }).notNull(),
  avatarUrl:      text("avatar_url"),
  passwordHash:   text("password_hash").notNull(),
  role:           userRoleEnum("role").default("user").notNull(),
  points:         integer("points").default(0).notNull(),
  isBanned:       boolean("is_banned").default(false).notNull(),
  lastLoginAt:    timestamp("last_login_at", { withTimezone: true }),
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:      timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  emailIdx: uniqueIndex("users_email_idx").on(t.email),
  phoneIdx: index("users_phone_idx").on(t.phoneWa),
}));

export const sessions = pgTable("sessions", {
  id:         uuid("id").defaultRandom().primaryKey(),
  userId:     uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash:  text("token_hash").notNull(),
  userAgent:  text("user_agent"),
  ipAddress:  varchar("ip_address", { length: 64 }),
  expiresAt:  timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ sessionTokenIdx: uniqueIndex("sessions_token_idx").on(t.tokenHash) }));

export const passwordResets = pgTable("password_resets", {
  id:        uuid("id").defaultRandom().primaryKey(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt:    timestamp("used_at", { withTimezone: true }),
});

// ============ CATALOG ============
export const games = pgTable("games", {
  id:         uuid("id").defaultRandom().primaryKey(),
  slug:       varchar("slug", { length: 120 }).notNull(),
  name:       varchar("name", { length: 120 }).notNull(),
  publisher:  varchar("publisher", { length: 120 }).notNull(),
  category:   varchar("category", { length: 60 }).notNull(),   // MOBA, FPS, BR, RPG...
  platform:   varchar("platform", { length: 40 }).notNull(),   // mobile, pc, both
  logoUrl:    text("logo_url"),
  bannerUrl:  text("banner_url"),
  needsZoneId:boolean("needs_zone_id").default(false).notNull(),
  hasJoki:    boolean("has_joki").default(false).notNull(),
  isActive:   boolean("is_active").default(true).notNull(),
  sortOrder:  integer("sort_order").default(0).notNull(),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ slugIdx: uniqueIndex("games_slug_idx").on(t.slug) }));

export const products = pgTable("products", {
  id:            uuid("id").defaultRandom().primaryKey(),
  gameId:        uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  sku:           varchar("sku", { length: 80 }).notNull(),
  label:         varchar("label", { length: 120 }).notNull(),    // "86 Diamond"
  nominalQty:    integer("nominal_qty").notNull(),
  priceCost:     numeric("price_cost", { precision: 12, scale: 2 }).notNull(),
  priceSell:     numeric("price_sell", { precision: 12, scale: 2 }).notNull(),
  margin:        numeric("margin", { precision: 12, scale: 2 }).notNull(),
  stock:         integer("stock").default(0).notNull(),
  supplierId:    uuid("supplier_id"),
  supplierSku:   varchar("supplier_sku", { length: 120 }),
  isActive:      boolean("is_active").default(true).notNull(),
  sortOrder:     integer("sort_order").default(0).notNull(),
  createdAt:     timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:     timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  skuIdx:  uniqueIndex("products_sku_idx").on(t.sku),
  gameIdx: index("products_game_idx").on(t.gameId),
}));

export const suppliers = pgTable("suppliers", {
  id:         uuid("id").defaultRandom().primaryKey(),
  name:       varchar("name", { length: 120 }).notNull(),
  baseUrl:    text("base_url").notNull(),
  apiKeyEnc:  text("api_key_enc").notNull(),       // AES-256-GCM
  isActive:   boolean("is_active").default(true).notNull(),
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const stockLogs = pgTable("stock_logs", {
  id:         uuid("id").defaultRandom().primaryKey(),
  productId:  uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  delta:      integer("delta").notNull(),
  beforeQty:  integer("before_qty").notNull(),
  afterQty:   integer("after_qty").notNull(),
  reason:     stockReasonEnum("reason").notNull(),
  refId:      uuid("ref_id"),
  note:       text("note"),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ productIdx: index("stock_logs_product_idx").on(t.productId) }));

// ============ JOKI RANK CATALOG ============
export const jokiTiers = pgTable("joki_tiers", {
  id:          uuid("id").defaultRandom().primaryKey(),
  gameId:      uuid("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  tierSlug:    varchar("tier_slug", { length: 80 }).notNull(),   // "epic-v", "legend-v"
  tierName:    varchar("tier_name", { length: 80 }).notNull(),
  orderIndex:  integer("order_index").notNull(),                 // urutan rank 1..N
  pricePerTier:numeric("price_per_tier", { precision: 12, scale: 2 }).notNull(),
  estimatedMin:integer("estimated_minutes").notNull(),
}, (t) => ({ gameTierIdx: uniqueIndex("joki_tier_unique_idx").on(t.gameId, t.tierSlug) }));

export const jokiWorkers = pgTable("joki_workers", {
  id:             uuid("id").defaultRandom().primaryKey(),
  userId:         uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName:    varchar("display_name", { length: 80 }).notNull(),
  ratingAvg:      numeric("rating_avg", { precision: 3, scale: 2 }).default("5.00").notNull(),
  ratingCount:    integer("rating_count").default(0).notNull(),
  skillGameIds:   jsonb("skill_game_ids").$type<string[]>().default([]).notNull(),
  isOnline:       boolean("is_online").default(false).notNull(),
  commissionPct:  numeric("commission_pct", { precision: 5, scale: 2 }).default("70.00").notNull(),
  activeOrders:   integer("active_orders").default(0).notNull(),
});

// ============ ORDERS (TOP-UP) ============
export const ordersTopup = pgTable("orders_topup", {
  id:              uuid("id").defaultRandom().primaryKey(),
  invoiceId:       varchar("invoice_id", { length: 40 }).notNull(),  // TUG-YYYY-XXXXXX
  userId:          uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  gameId:          uuid("game_id").notNull().references(() => games.id, { onDelete: "restrict" }),
  productId:       uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  gameUserId:      varchar("game_user_id", { length: 80 }).notNull(),
  gameZoneId:      varchar("game_zone_id", { length: 80 }),
  gameNickname:    varchar("game_nickname", { length: 120 }),
  qty:             integer("qty").default(1).notNull(),
  subtotal:        numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount:        numeric("discount", { precision: 12, scale: 2 }).default("0").notNull(),
  fee:             numeric("fee", { precision: 12, scale: 2 }).default("0").notNull(),
  total:           numeric("total", { precision: 12, scale: 2 }).notNull(),
  voucherId:       uuid("voucher_id"),
  status:          orderStatusEnum("status").default("PENDING_PAYMENT").notNull(),
  paymentMethod:   paymentMethodEnum("payment_method"),
  supplierRef:     varchar("supplier_ref", { length: 120 }),
  supplierResp:    jsonb("supplier_resp"),
  retryCount:      integer("retry_count").default(0).notNull(),
  expiresAt:       timestamp("expires_at", { withTimezone: true }).notNull(),
  paidAt:          timestamp("paid_at", { withTimezone: true }),
  processedAt:     timestamp("processed_at", { withTimezone: true }),
  completedAt:     timestamp("completed_at", { withTimezone: true }),
  notes:           text("notes"),
  createdAt:       timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:       timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  invoiceIdx: uniqueIndex("orders_topup_invoice_idx").on(t.invoiceId),
  userIdx:    index("orders_topup_user_idx").on(t.userId, t.createdAt),
  statusIdx:  index("orders_topup_status_idx").on(t.status),
}));

// ============ ORDERS (JOKI) ============
export const ordersJoki = pgTable("orders_joki", {
  id:               uuid("id").defaultRandom().primaryKey(),
  invoiceId:        varchar("invoice_id", { length: 40 }).notNull(),   // TUG-JKI-YYYY-XXXXXX
  userId:           uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  gameId:           uuid("game_id").notNull().references(() => games.id, { onDelete: "restrict" }),
  workerId:         uuid("worker_id").references(() => jokiWorkers.id, { onDelete: "set null" }),
  startTierId:      uuid("start_tier_id").notNull().references(() => jokiTiers.id),
  targetTierId:     uuid("target_tier_id").notNull().references(() => jokiTiers.id),
  currentTierId:    uuid("current_tier_id").references(() => jokiTiers.id),
  gameLoginEnc:     text("game_login_enc").notNull(),                 // AES-256-GCM (JSON: username,password,backupCode)
  accountEmail:     varchar("account_email", { length: 200 }),
  notes:            text("notes"),
  subtotal:         numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount:         numeric("discount", { precision: 12, scale: 2 }).default("0").notNull(),
  fee:              numeric("fee", { precision: 12, scale: 2 }).default("0").notNull(),
  total:            numeric("total", { precision: 12, scale: 2 }).notNull(),
  voucherId:        uuid("voucher_id"),
  etaMinutes:       integer("eta_minutes").notNull(),
  status:           jokiStatusEnum("status").default("PENDING_PAYMENT").notNull(),
  paymentMethod:    paymentMethodEnum("payment_method"),
  progressPercent:  smallint("progress_percent").default(0).notNull(),
  paidAt:           timestamp("paid_at", { withTimezone: true }),
  startedAt:        timestamp("started_at", { withTimezone: true }),
  completedAt:      timestamp("completed_at", { withTimezone: true }),
  workerCommission: numeric("worker_commission", { precision: 12, scale: 2 }),
  createdAt:        timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:        timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  invoiceIdx: uniqueIndex("orders_joki_invoice_idx").on(t.invoiceId),
  userIdx:    index("orders_joki_user_idx").on(t.userId, t.createdAt),
  workerIdx:  index("orders_joki_worker_idx").on(t.workerId, t.status),
}));

// ============ PAYMENTS (XENDIT + MANUAL) ============
export const payments = pgTable("payments", {
  id:             uuid("id").defaultRandom().primaryKey(),
  referenceType:  varchar("reference_type", { length: 20 }).notNull(),  // 'topup' | 'joki'
  referenceId:    uuid("reference_id").notNull(),
  method:         paymentMethodEnum("method").notNull(),
  amount:         numeric("amount", { precision: 12, scale: 2 }).notNull(),
  feeAmount:      numeric("fee_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  status:         paymentStatusEnum("status").default("PENDING").notNull(),
  externalId:     varchar("external_id", { length: 120 }),        // Xendit invoice id / reference
  xenditPaymentId:varchar("xendit_payment_id", { length: 120 }),
  xenditMethod:   varchar("xendit_method", { length: 60 }),       // QRIS/BCA/OVO...
  vaNumber:       varchar("va_number", { length: 60 }),
  qrString:       text("qr_string"),
  paidAt:         timestamp("paid_at", { withTimezone: true }),
  expiresAt:      timestamp("expires_at", { withTimezone: true }),
  rawPayload:     jsonb("raw_payload"),
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:      timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  refIdx:      index("payments_ref_idx").on(t.referenceType, t.referenceId),
  externalIdx: index("payments_external_idx").on(t.externalId),
}));

export const paymentProofs = pgTable("payment_proofs", {
  id:          uuid("id").defaultRandom().primaryKey(),
  paymentId:   uuid("payment_id").notNull().references(() => payments.id, { onDelete: "cascade" }),
  fileUrl:     text("file_url").notNull(),
  fileSha256:  varchar("file_sha256", { length: 64 }).notNull(),
  uploadedBy:  uuid("uploaded_by").notNull().references(() => users.id),
  verifiedBy:  uuid("verified_by").references(() => users.id),
  verifiedAt:  timestamp("verified_at", { withTimezone: true }),
  rejectReason:text("reject_reason"),
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const paymentEvents = pgTable("payment_events", {
  id:             uuid("id").defaultRandom().primaryKey(),
  externalId:     varchar("external_id", { length: 120 }).notNull(),
  eventType:      varchar("event_type", { length: 60 }).notNull(),
  referenceType:  varchar("reference_type", { length: 20 }),
  referenceId:    uuid("reference_id"),
  payload:        jsonb("payload").notNull(),
  processedAt:    timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  extUniq: uniqueIndex("payment_events_external_idx").on(t.externalId, t.eventType),
}));

// ============ VOUCHERS ============
export const vouchers = pgTable("vouchers", {
  id:            uuid("id").defaultRandom().primaryKey(),
  code:          varchar("code", { length: 40 }).notNull(),
  type:          varchar("type", { length: 20 }).notNull(),   // PERCENT | FIXED
  value:         numeric("value", { precision: 12, scale: 2 }).notNull(),
  maxDiscount:   numeric("max_discount", { precision: 12, scale: 2 }),
  minSpend:      numeric("min_spend", { precision: 12, scale: 2 }).default("0").notNull(),
  quotaTotal:    integer("quota_total").notNull(),
  quotaUsed:     integer("quota_used").default(0).notNull(),
  perUserLimit:  integer("per_user_limit").default(1).notNull(),
  scope:         varchar("scope", { length: 20 }).default("ALL").notNull(), // ALL|TOPUP|JOKI
  validFrom:     timestamp("valid_from", { withTimezone: true }).notNull(),
  validUntil:    timestamp("valid_until", { withTimezone: true }).notNull(),
  isActive:      boolean("is_active").default(true).notNull(),
  createdAt:     timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ codeIdx: uniqueIndex("vouchers_code_idx").on(t.code) }));

export const voucherUsages = pgTable("voucher_usages", {
  id:            uuid("id").defaultRandom().primaryKey(),
  voucherId:     uuid("voucher_id").notNull().references(() => vouchers.id, { onDelete: "cascade" }),
  userId:        uuid("user_id").notNull().references(() => users.id),
  referenceType: varchar("reference_type", { length: 20 }).notNull(),
  referenceId:   uuid("reference_id").notNull(),
  discountValue: numeric("discount_value", { precision: 12, scale: 2 }).notNull(),
  createdAt:     timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============ CHAT JOKI <-> USER ============
export const chatRooms = pgTable("chat_rooms", {
  id:          uuid("id").defaultRandom().primaryKey(),
  orderJokiId: uuid("order_joki_id").notNull().references(() => ordersJoki.id, { onDelete: "cascade" }),
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ orderUniq: uniqueIndex("chat_rooms_order_idx").on(t.orderJokiId) }));

export const chatMessages = pgTable("chat_messages", {
  id:         uuid("id").defaultRandom().primaryKey(),
  roomId:     uuid("room_id").notNull().references(() => chatRooms.id, { onDelete: "cascade" }),
  senderId:   uuid("sender_id").notNull().references(() => users.id),
  senderRole: userRoleEnum("sender_role").notNull(),
  body:       text("body"),
  attachmentUrl: text("attachment_url"),
  readAt:     timestamp("read_at", { withTimezone: true }),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ roomIdx: index("chat_messages_room_idx").on(t.roomId, t.createdAt) }));

export const jokiProgressLogs = pgTable("joki_progress_logs", {
  id:             uuid("id").defaultRandom().primaryKey(),
  orderJokiId:    uuid("order_joki_id").notNull().references(() => ordersJoki.id, { onDelete: "cascade" }),
  fromTierId:     uuid("from_tier_id").references(() => jokiTiers.id),
  toTierId:       uuid("to_tier_id").references(() => jokiTiers.id),
  progressPercent:smallint("progress_percent").notNull(),
  screenshotUrl:  text("screenshot_url"),
  note:           text("note"),
  createdBy:      uuid("created_by").notNull().references(() => users.id),
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============ NOTIFICATIONS (WHATSAPP + IN-APP) ============
export const notificationTemplates = pgTable("notification_templates", {
  id:        uuid("id").defaultRandom().primaryKey(),
  code:      varchar("code", { length: 60 }).notNull(),       // ORDER_PAID, JOKI_PROGRESS, ...
  channel:   varchar("channel", { length: 20 }).default("WHATSAPP").notNull(),
  subject:   varchar("subject", { length: 160 }),
  body:      text("body").notNull(),                          // template dengan {{var}}
  isActive:  boolean("is_active").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ codeIdx: uniqueIndex("notif_tpl_code_idx").on(t.code, t.channel) }));

export const whatsappLogs = pgTable("whatsapp_logs", {
  id:         uuid("id").defaultRandom().primaryKey(),
  userId:     uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  phone:      varchar("phone", { length: 20 }).notNull(),
  templateCode: varchar("template_code", { length: 60 }).notNull(),
  payload:    jsonb("payload"),
  status:     varchar("status", { length: 20 }).notNull(),    // SENT|FAILED|QUEUED
  providerRef:varchar("provider_ref", { length: 120 }),
  errorMsg:   text("error_msg"),
  attempt:    smallint("attempt").default(1).notNull(),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ userIdx: index("wa_logs_user_idx").on(t.userId, t.createdAt) }));

export const inAppNotifications = pgTable("in_app_notifications", {
  id:        uuid("id").defaultRandom().primaryKey(),
  userId:    uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title:     varchar("title", { length: 160 }).notNull(),
  body:      text("body").notNull(),
  link:      text("link"),
  readAt:    timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ userIdx: index("inapp_user_idx").on(t.userId, t.readAt) }));

// ============ AUDIT LOG (IMMUTABLE) ============
export const auditLogs = pgTable("audit_logs", {
  id:           uuid("id").defaultRandom().primaryKey(),
  actorId:      uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  actorRole:    varchar("actor_role", { length: 30 }),
  action:       auditActionEnum("action").notNull(),
  entityType:   varchar("entity_type", { length: 60 }).notNull(), // order_topup|order_joki|payment|product_price|stock|user|...
  entityId:     uuid("entity_id"),
  referenceCode:varchar("reference_code", { length: 80 }),
  beforeData:   jsonb("before_data"),
  afterData:    jsonb("after_data"),
  diff:         jsonb("diff"),
  ipAddress:    varchar("ip_address", { length: 64 }),
  userAgent:    text("user_agent"),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  entityIdx: index("audit_entity_idx").on(t.entityType, t.entityId, t.createdAt),
  actorIdx:  index("audit_actor_idx").on(t.actorId, t.createdAt),
}));

// ============ REVIEWS & SETTINGS ============
export const reviews = pgTable("reviews", {
  id:             uuid("id").defaultRandom().primaryKey(),
  userId:         uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referenceType:  varchar("reference_type", { length: 20 }).notNull(),  // topup|joki
  referenceId:    uuid("reference_id").notNull(),
  rating:         smallint("rating").notNull(),
  comment:        text("comment"),
  isPublished:    boolean("is_published").default(true).notNull(),
  createdAt:      timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  key:       varchar("key", { length: 80 }).primaryKey(),
  value:     jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### Variabel Lingkungan (`.env.example`)
```env
# ===== APP =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=TopUpGame
NODE_ENV=development
TZ=Asia/Jakarta

# ===== DATABASE =====
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/topupgame?sslmode=require
DATABASE_POOL_URL=postgresql://user:pass@ep-xxx-pooler.us-east-1.aws.neon.tech/topupgame?sslmode=require

# ===== AUTH =====
AUTH_SECRET=super-long-random-32-chars-min
AUTH_URL=http://localhost:3000
AUTH_COOKIE_DOMAIN=localhost
ENCRYPTION_KEY=base64-32bytes-aes-256-gcm-key-for-joki-login

# ===== REDIS (Upstash) =====
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx

# ===== STORAGE (Cloudflare R2) =====
R2_ACCOUNT_ID=xxxxxxxx
R2_ACCESS_KEY_ID=xxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxx
R2_BUCKET=topupgame-files
R2_PUBLIC_URL=https://cdn.topupgame.id

# ===== XENDIT =====
XENDIT_SECRET_KEY=xnd_development_xxxxxxxx
XENDIT_PUBLIC_KEY=xnd_public_development_xxxxxxxx
XENDIT_CALLBACK_TOKEN=xxxxxxxx   # untuk verifikasi webhook (x-callback-token)
XENDIT_WEBHOOK_URL=https://topupgame.id/api/webhooks/xendit
XENDIT_SUCCESS_REDIRECT_URL=https://topupgame.id/dashboard/orders
XENDIT_FAILURE_REDIRECT_URL=https://topupgame.id/dashboard/orders

# ===== TRANSFER MANUAL =====
MANUAL_BANK_NAME=BCA
MANUAL_BANK_ACCOUNT=1234567890
MANUAL_BANK_HOLDER=PT TopUpGame Indonesia

# ===== WHATSAPP GATEWAY (Fonnte/Wablas) =====
WA_PROVIDER=fonnte
WA_API_URL=https://api.fonnte.com/send
WA_API_TOKEN=xxxxxxxxxxxxxxxx
WA_SENDER_NUMBER=6281234567890

# ===== EMAIL (verifikasi & reset) =====
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=xxxxxxxx
EMAIL_FROM="TopUpGame <no-reply@topupgame.id>"

# ===== CRON / WORKER =====
CRON_SECRET=xxxxxxxx
SUPPLIER_SYNC_INTERVAL_MIN=5
ORDER_EXPIRY_MIN=30

# ===== ADMIN BOOTSTRAP =====
SUPER_ADMIN_EMAIL=owner@topupgame.id
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut (Atomic Tasks) dengan format checklist markdown `- [ ] **Task X.Y**`. Dirancang khusus agar pengguna dapat menginstruksikan AI Coding Assistant (Cursor, Claude Code, Roo Code, dll.) untuk mengeksekusi proyek langkah demi langkah secara terukur, modular, dan bebas dari kehabisan context window.*

### Tahap 1: Fondasi Proyek, UI/UX, & Semua Halaman (Dummy Data)
*Tujuan: Membangun seluruh antarmuka visual secara 100% lengkap dan responsif menggunakan data dummy sebelum menyentuh database.*
- [x] **Task 1.1 (Foundations & Design System)**: Setup Next.js 15 + TypeScript + Tailwind v4, konfigurasi CSS variable token warna (Primary HSL(258,90%,60%), Accent HSL(190,95%,50%), Dark mode), font `Plus Jakarta Sans`, `Inter`, `JetBrains Mono`, install shadcn/ui (Button, Card, Input, Form, Dialog, Drawer, Table, Badge, Dropdown, Tabs, Toast), dan tema dark mode toggle.
- [x] **Task 1.2 (Layouts & Persistent Navigation)**: Buat Root Layout, `(public)` layout dengan Header/Navbar + Footer, `(dashboard)` layout dengan Sidebar persisten untuk User, `(joki)` layout untuk Panel Joki, `(admin)` layout untuk Admin dengan grup menu, serta mobile drawer responsif.
- [x] **Task 1.3 (Public Pages – Katalog & Konten)**: Buat `/`, `/top-up`, `/top-up/[slug]` (dengan interaktif pilih nominal + preview harga), `/joki`, `/joki/[slug]` (dengan kalkulator estimasi harga & durasi dummy), `/promo`, `/blog`, `/blog/[slug]`, `/tentang`, `/kontak`, `/faq`, `/syarat-ketentuan`, `/kebijakan-privasi`, `/lacak` (form input Invoice ID).
- [x] **Task 1.4 (Auth Pages UI)**: Buat `/login`, `/register`, `/forgot-password`, `/reset-password` dengan validasi form dummy (react-hook-form + zod) dan state loading/error.
- [x] **Task 1.5 (User Dashboard Pages – Dummy)**: Buat `/dashboard`, `/dashboard/orders` (DataTable dengan filter status & pagination), `/dashboard/orders/[id]` (timeline status + invoice mockup + upload bukti dummy), `/dashboard/joki`, `/dashboard/joki/[id]` (progress bar rank + chat mockup + upload screenshot), `/dashboard/invoice/[id]`, `/dashboard/chat`, `/dashboard/profile`, `/dashboard/vouchers`, `/dashboard/notifications`.
- [x] **Task 1.6 (Joki Panel Pages – Dummy)**: Buat `/joki-panel`, `/joki-panel/orders`, `/joki-panel/orders/[id]` (update progress dummy + chat mockup), `/joki-panel/earnings`.
- [x] **Task 1.7 (Admin Pages – Dummy)**: Buat `/admin`, `/admin/games` (CRUD dummy + modal form), `/admin/products` (DataTable + filter game), `/admin/pricing`, `/admin/vouchers`, `/admin/orders/topup`, `/admin/orders/joki` (assign joki modal), `/admin/payments` (antrean bukti transfer + approve/reject), `/admin/suppliers`, `/admin/stock`, `/admin/reports` (chart + filter tanggal + export dummy), `/admin/users`, `/admin/joki`, `/admin/notifications`, `/admin/audit-logs` (timeline diff before/after), `/admin/settings`.
- [x] **Task 1.8 (Mobile App Foundation – Expo)**: Setup Expo + Expo Router + TanStack Query + NativeWind (Tailwind untuk RN), sinkronkan design token warna & tipografi, buat bottom tab (Home, Katalog, Order, Chat, Profil) dan layar Auth + layar Katalog + Detail Produk dummy.
- [x] **Task 1.9 (UI Polish & Empty States)**: Skeleton loading di semua list/kartu, empty state ilustratif, micro-animation Framer Motion, hover lift, dan audit responsivitas di viewport 360/768/1280.

### Tahap 2: Database, Autentikasi, Integrasi Data & Realtime
*Tujuan: Menghidupkan aplikasi dengan database nyata, sistem autentikasi pengguna, API/Server Actions, dan chat realtime.*
- [x] **Task 2.1 (Database Schema & Migrations)**: Buat `db/schema.ts` sesuai skema di Bab 10, jalankan `drizzle-kit generate` + `drizzle-kit migrate` ke Neon, buat `db/seed.ts` dengan data dummy realistis (games: `mobile-legends`, `free-fire`, `pubg-mobile`, `valorant`, `genshin-impact`; products; joki_tiers; vouchers `HEMAT20`, `NEWUSER5K`; users & admin).
- [x] **Task 2.2 (Authentication Email/Password)**: Setup Better Auth, buat route `/api/auth/[...]`, implementasi register + verifikasi email (SMTP), login, logout, forgot/reset password, session middleware, dan role guard (`user`, `joki`, `admin`, `super_admin`).
- [x] **Task 2.3 (Route Middleware & Role Protection)**: Buat `middleware.ts` untuk melindungi `/dashboard`, `/joki-panel`, `/admin`, dan membatasi akses sesuai role; redirect unauthorized ke `/login` atau `/403`.
- [x] **Task 2.4 (Server Actions – Katalog & Produk)**: Buat Server Actions + Zod schema untuk CRUD `games`, `products`, `joki_tiers`, `vouchers`, `suppliers` dengan validasi server dan penulisan `audit_logs` (`entity_type='product_price'` untuk perubahan harga).
- [x] **Task 2.5 (Server Actions – Order Top-Up & Joki)**: Buat Server Actions untuk `createOrderTopup`, `createOrderJoki`, `calculateJokiEstimate`, `attachPaymentProof`, `updateJokiProgress`, `completeJokiOrder`, validasi (Rank Tujuan > Rank Awal, stok > 0, voucher valid), dan enkripsi `game_login_enc` AES-256-GCM.
- [x] **Task 2.6 (Audit Log Middleware)**: Buat helper `writeAuditLog({actorId, action, entityType, entityId, before, after})` dengan auto-diff JSONB; integrasikan ke semua Server Actions kritis (order, payment, harga, stok, user admin); proteksi DB `audit_logs` agar UPDATE/DELETE ditolak.
- [x] **Task 2.7 (Frontend Data Binding & Mutations)**: Ganti seluruh data dummy di halaman Public, User Dashboard, Joki Panel, dan Admin dengan query TanStack Query / Server Actions nyata, termasuk optimistic update di chat dan form.
- [x] **Task 2.8 (Realtime Chat & Notifikasi In-App)**: Implementasi server WebSocket / Supabase Realtime untuk `chat_rooms` + `chat_messages`, upload attachment ke R2, indikator read/unread, dan notifikasi in-app realtime.
- [x] **Task 2.9 (Mobile App Data Layer)**: Integrasikan mobile Expo dengan API/Server Actions yang sama (login, katalog, order top-up, order joki, chat, tracking), simpan token di SecureStore.

### Tahap 3: Integrasi Xendit, WhatsApp Gateway, Keamanan, SEO, Testing & Deployment
*Tujuan: Menyempurnakan integrasi eksternal, optimasi performa, keamanan, dan rilis ke production.*
- [x] **Task 3.1 (Integrasi Xendit Invoice & Webhook)**: Buat `createXenditInvoice` (QRIS, VA, E-Wallet Dana/OVO/GoPay, Retail) di Server Action, buat route `/api/webhooks/xendit` dengan verifikasi `x-callback-token`, simpan `payment_events` idempotent, dan map status (`PAID`, `EXPIRED`, `FAILED`) ke `payments` + `orders_topup`/`orders_joki`, serta tulis `audit_logs`.
- [x] **Task 3.2 (Verifikasi Transfer Manual)**: Buat flow upload bukti ke `payment_proofs` (R2 + sha256), halaman `/admin/payments` dengan preview bukti + approve/reject (isi `reject_reason`), validasi nominal (UNDERPAID/OVERPAID), dan audit log `entity_type='payment'`.
- [x] **Task 3.3 (Integrasi Supplier & Sinkronisasi Stok)**: Buat adapter supplier (`lib/suppliers/*.ts`) untuk createOrder ke API supplier pada top-up yang sudah `PAID`, handling retry 3x exponential backoff, cron job sinkronisasi stok per `SUPPLIER_SYNC_INTERVAL_MIN`, dan update `stock_logs` + `products.stock`.
- [x] **Task 3.4 (WhatsApp Gateway & Template Notifikasi)**: Integrasikan Fonnte/Wablas via `lib/wa.ts`, CRUD `notification_templates` di `/admin/notifications`, trigger pada event (`ORDER_CREATED`, `ORDER_PAID`, `TOPUP_SUCCESS`, `JOKI_PROGRESS`, `JOKI_COMPLETED`, `REFUND_ISSUED`), dedupe per `order_id+event`, retry 3x, log ke `whatsapp_logs` dan `audit_logs` (`entity_type='notification'`).
- [x] **Task 3.5 (Auto-Expiry & Cron Worker)**: Buat cron untuk mengekspire order `PENDING_PAYMENT` setelah `ORDER_EXPIRY_MIN`, retry supplier gagal, retry webhook pending, dan retry WhatsApp gagal — semua di-secure dengan `CRON_SECRET`.
- [x] **Task 3.6 (Non-Functional, SEO & Security)**: Implementasi metadata dinamis (`generateMetadata`) dengan Open Graph & Twitter Card, JSON-LD (`Product`, `Offer`, `FAQPage`, `BreadcrumbList`), sitemap.xml + robots.txt, header keamanan (CSP, HSTS, X-Frame-Options), sanitasi XSS di artikel blog, rate limiting (Upstash) untuk login/chat/lacak, dan validasi Zod di semua input.
- [x] **Task 3.7 (End-to-End Testing & Bugfix)**: Uji end-to-end alur (register → verifikasi email → top-up Xendit → success → notifikasi WA → invoice; top-up transfer manual → upload bukti → approve admin → proses; order joki → chat → progress → selesai), uji mobile app (login, checkout, tracking, chat), perbaiki responsive glitch & optimasi query DB (index check).
- [x] **Task 3.8 (Production Build & Deployment)**: Konfigurasi `.env.production`, verifikasi `npm run build` lulus tanpa error, deploy Web ke Vercel, Mobile ke EAS Build (Android/iOS), setup domain + SSL, setup monitoring (Sentry + Vercel Analytics), dan smoke test production.

---
