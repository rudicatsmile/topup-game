# Panduan Pengguna (User Guide) — TopUpGame

Selamat datang di **TopUpGame**, platform top-up diamond game tercepat dan layanan joki rank terpercaya di Indonesia. Panduan ini menjelaskan cara menggunakan seluruh fitur aplikasi dari sisi pengguna (pembeli/member).

---

## 1. Memulai & Masuk ke Akun

### A. Pendaftaran Akun Baru
1. Buka halaman utama lalu klik tombol **"Daftar"** di pojok kanan atas (atau akses `/register`).
2. Masukkan **Nama Lengkap**, **Alamat Email**, **Nomor WhatsApp (+62)**, dan buat **Kata Sandi** (minimal 8 karakter).
3. Centang persetujuan Syarat & Ketentuan, lalu klik **"Daftar Akun Sekarang"**.
4. Anda akan langsung otomatis masuk dan diarahkan ke Dashboard Member.

### B. Masuk ke Akun (Login)
1. Kunjungi `/login`.
2. Masukkan email dan kata sandi Anda.
3. *Untuk Pengujian Cepat (Mode Demo)*: Anda dapat mengklik tombol preset akun di bawah form:
   - **Member**: `gamer.sultan@gmail.com`
   - **Joki**: `worker.budi@topupgame.id`
   - **Admin**: `owner@topupgame.id`
   *(Kata sandi demo default: `Password123!`)*

### C. Lupa & Reset Kata Sandi
1. Pada halaman login, klik **"Lupa kata sandi?"** atau kunjungi `/forgot-password`.
2. Masukkan email terdaftar, lalu klik **"Kirim Tautan Pemulihan"**.
3. Buka tautan reset yang dikirimkan (atau akses `/reset-password?token=...`) untuk memasukkan kata sandi baru.

---

## 2. Cara Melakukan Top-Up Diamond Game

1. **Pilih Game**:
   - Di halaman utama (`/`) atau katalog (`/top-up`), pilih game favorit Anda (contoh: *Mobile Legends, Free Fire, PUBG Mobile, Valorant, Genshin Impact*).
2. **Masukkan Data Akun Game**:
   - Masukkan **User ID** dan **Zone ID / Server ID** (jika game memerlukannya, seperti MLBB atau Genshin).
   - Klik tombol **"Cek Nickname"** untuk memvalidasi nama karakter game Anda secara instan.
3. **Pilih Nominal Produk**:
   - Pilih paket diamond/koin yang diinginkan (tersedia penanda *Best Seller* dan harga promo).
4. **Pilih Metode Pembayaran**:
   - **QRIS**: Pembayaran instan via GoPay, OVO, Dana, ShopeePay, BCA, Livin, dll.
   - **Virtual Account (VA)**: BCA, Mandiri, BRI, BNI.
   - **E-Wallet**: Dana, OVO, ShopeePay.
   - **Transfer Bank Manual**: Transfer ke rekening resmi BCA PT TopUpGame Indonesia (bebas biaya admin).
5. **Gunakan Kode Voucher Diskon**:
   - Masukkan kode voucher seperti **`HEMAT20`** (diskon 20%) atau **`NEWUSER5K`** (potongan Rp 5.000), lalu klik **"Gunakan"**.
6. **Selesaikan Pembayaran**:
   - Masukkan nomor WhatsApp untuk menerima notifikasi rincian pembayaran.
   - Klik **"Beli Sekarang"**, periksa modal konfirmasi ringkasan biaya, lalu klik **"Lanjut Bayar"**.
   - Selesaikan pembayaran sesuai petunjuk (scan QRIS / transfer ke nomor VA). Diamond akan otomatis masuk ke akun Anda dalam hitungan 1-3 detik!

---

## 3. Cara Memesan Layanan Joki Rank

1. **Buka Menu Joki**:
   - Akses `/joki` dan pilih game yang ingin di-push rank (contoh: *Mobile Legends*).
2. **Kalkulator Rank Interaktif**:
   - Pilih **Rank Awal** saat ini (contoh: *Epic V*) dan **Rank Tujuan** yang diinginkan (contoh: *Mythic*).
   - Sistem secara otomatis menghitung total harga transparan serta estimasi waktu penyelesaian (durasi jam).
3. **Pilih Penjoki (Opsional)**:
   - Anda dapat memilih opsi *"Pilih Otomatis (Penjoki Terbaik yang Online)"* atau memilih langsung worker profesional berdasarkan rating dan win rate.
4. **Data Akun Aman (Enkripsi End-to-End)**:
   - Pilih metode login game (contoh: Moonton ID, Google Play, VK).
   - Masukkan Email/ID dan Password akun game Anda.
   - *(Keamanan Terjamin: Password Anda langsung dienkripsi menggunakan algoritma standar militer **AES-256-GCM**. Tidak ada yang dapat melihat kredensial selain worker resmi yang bertanding, dan setiap pembukaan password dicatat dalam audit log).*
5. **Konfirmasi & Bayar**:
   - Masukkan catatan khusus untuk penjoki (contoh: *"Fokus hero Assassin/Mage, jangan main hero Tank"*).
   - Selesaikan pembayaran. Pesanan Anda akan langsung masuk ke antrean worker.

---

## 4. Dashboard Member & Fitur Interaktif

Setelah login, akses menu Dashboard di `/dashboard`:
- **Ringkasan Akun (`/dashboard`)**: Melihat total transaksi, pesanan aktif, poin reward, dan pintasan top-up.
- **Daftar Pesanan (`/dashboard/orders`)**:
  - Memantau status pesanan: *Menunggu Pembayaran, Diproses, Sukses, Selesai, atau Dibatalkan*.
  - Mengunggah bukti transfer manual jika memilih metode transfer bank.
- **Pantau Joki & Live Chat (`/dashboard/joki/[id]`)**:
  - Melihat progress bar pencapaian rank secara real-time.
  - Berinteraksi langsung dengan penjoki melalui **Live Chat Realtime**.
  - Melihat galeri screenshot hasil kemenangan pertandingan yang diunggah penjoki.
- **Unduh Invoice PDF (`/dashboard/invoice/[id]`)**:
  - Melihat rincian transaksi lengkap dan mencetak faktur/invoice resmi siap PDF.
- **Klaim Voucher Promo (`/dashboard/vouchers`)**:
  - Melihat kupon diskon aktif yang siap digunakan pada transaksi berikutnya.
- **Notifikasi In-App (`/dashboard/notifications`)**:
  - Mendapatkan pemberitahuan langsung saat diamond sukses masuk atau progres joki bertambah.

---

## 5. Melacak Pesanan Tanpa Login (Fitur Lacak)

Jika Anda melakukan pembelian tanpa login:
1. Buka menu **"Lacak"** di navigasi atas (`/lacak`).
2. Masukkan nomor Invoice pesanan Anda (contoh: `TUG-2025-000431` atau `TUG-JKI-...`).
3. Klik **"Lacak Pesanan"**. Status terkini pembayaran dan proses pengisian game akan langsung ditampilkan.
