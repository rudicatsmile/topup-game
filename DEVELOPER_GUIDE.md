# Panduan Developer & Arsitektur Sistem (Developer Guide) — TopUpGame

Panduan teknis komprehensif bagi Software Engineer, DevOps, dan Fullstack Architect untuk memelihara, mengembangkan, dan mendeploy platform **TopUpGame**.

---

## 1. Arsitektur & Tech Stack

| Lapisan | Teknologi | Deskripsi |
|---|---|---|
| **Framework** | Next.js 15.5+ (App Router) | React Server Components, Server Actions, Route Handlers, Edge Middleware |
| **Bahasa** | TypeScript 5.7+ | Strict mode, Zod runtime validation |
| **Styling & UI** | Tailwind CSS v4 + Radix UI Primitives | Neo-Gaming Design System (Primary HSL 258/90/60, Accent HSL 190/95/50), Framer Motion, Lucide Icons |
| **Database & ORM** | Neon PostgreSQL + Drizzle ORM | Serverless pool connection, PgBouncer compatible, immutable audit logging |
| **Autentikasi** | Better Auth / Custom Session JWT | Bcrypt password hashing (salt 10), HTTP-only Signed JWT Session cookies via `jose` |
| **Keamanan Data** | AES-256-GCM | Enkripsi simetris dengan IV acak dan auth tag 16-byte untuk kredensial game & API keys |
| **Payment Gateway** | Xendit API + Transfer Manual | Invoice v2, QRIS dinamis, VA, E-Wallet, webhook handler dengan idempotency table |
| **Supplier Engine** | Digiflazz Adapter + Dispatcher | MD5 signature, retry 3x exponential backoff (1s, 2s, 4s), mutasi stok otomatis |
| **Notifikasi** | WhatsApp Gateway (Fonnte/Wablas) | Templating string, format telepon otomatis, deduplikasi event agar bebas spam |
| **Realtime** | Server-Sent Events (SSE) | Streaming live chat joki dan notifikasi in-app tanpa dependensi websocket eksternal |
| **Mobile App** | React Native (Expo SDK 52) | Expo Router, NativeWind, SecureStore token storage, Expo EAS Build |

---

## 2. Struktur Direktori Proyek

```
topup-game/
├── mobile/                     # Aplikasi Mobile (React Native Expo)
│   ├── app/                    # Expo Router screens (tabs: Home, Katalog, Order, Chat, Profil)
│   ├── lib/
│   │   ├── api.ts              # Mobile HTTP API Client
│   │   └── storage.ts          # SecureStore token storage abstraction
│   ├── app.json                # Konfigurasi Expo Application
│   ├── eas.json                # Konfigurasi Expo EAS Build (APK & iOS IPA)
│   └── package.json
├── scripts/
│   └── smoke-test.ts           # Script pengujian otomatis seluruh business logic
├── src/
│   ├── actions/                # Next.js Server Actions (Mutasi DB dengan Zod)
│   │   ├── catalog.ts          # CRUD Game, Produk, Tier Joki, Voucher, Supplier
│   │   ├── orders.ts           # createOrderTopup, createOrderJoki, joki progress, decrypt
│   │   ├── payments.ts         # verifyManualPayment (Approve/Reject), upload proof
│   │   ├── chat.ts             # sendChatMessage, markMessagesAsRead
│   │   └── notifications.ts    # getUserNotifications, markNotificationAsRead
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/admin/      # 16 Halaman Konsol Administrator
│   │   ├── (dashboard)/        # 10 Halaman Dashboard Pengguna (Member)
│   │   ├── (joki)/joki-panel/  # 4 Halaman Khusus Penjoki Rank
│   │   ├── (public)/           # 15 Halaman Publik (Beranda, Katalog, Joki, Auth, Blog, Lacak)
│   │   ├── api/                # API Route Handlers
│   │   │   ├── auth/           # /api/auth/[login, register, logout, me, forgot, reset]
│   │   │   ├── cron/           # /api/cron/[orders-expiry, suppliers-sync, retry-failed]
│   │   │   ├── orders/track/   # /api/orders/track (Pencarian invoice publik)
│   │   │   ├── realtime/       # /api/realtime/[chat, notifications] (Streaming SSE)
│   │   │   └── webhooks/xendit # /api/webhooks/xendit (Callback pembayaran Xendit)
│   │   ├── globals.css         # Tailwind v4 token warna & custom gaming styling
│   │   ├── layout.tsx          # Root Layout + OpenGraph + JSON-LD Schema
│   │   ├── robots.ts           # Generator robots.txt
│   │   └── sitemap.ts          # Generator sitemap.xml dinamis
│   ├── components/
│   │   ├── shared/             # Navbar, Footer, Sidebar (User, Joki, Admin), Skeletons
│   │   └── ui/                 # Primitives shadcn/ui (Button, Card, Dialog, Input, Table, dll)
│   ├── db/
│   │   ├── migrations/         # Drizzle SQL Migrations
│   │   ├── index.ts            # Neon Pool Client & Error Event Handler
│   │   ├── schema.ts           # Skema 25 Tabel & 7 Enum Drizzle ORM
│   │   └── seed.ts             # Seeder data realistis
│   ├── lib/
│   │   ├── audit.ts            # Immutable Audit Logger + JSONB Auto-Diff
│   │   ├── auth.ts             # Hashing bcrypt + JWT Session Cookies
│   │   ├── encryption.ts       # Enkripsi & Dekripsi AES-256-GCM
│   │   ├── rate-limit.ts       # Token bucket rate limiting
│   │   ├── suppliers/          # Digiflazz Adapter & Dispatcher Engine
│   │   ├── utils.ts            # cn, formatRupiah, formatDate
│   │   ├── wa.ts               # WhatsApp Gateway Service
│   │   └── xendit.ts           # Xendit Invoice & Token Verification
│   └── middleware.ts           # Route Protection & Role Guard
├── drizzle.config.ts           # Konfigurasi Drizzle Kit
├── next.config.ts              # Konfigurasi Next.js + Enterprise Security Headers
├── vercel.json                 # Konfigurasi Deployment & Scheduled Cron Vercel
├── .env.example                # Variabel lingkungan development
└── .env.production.example     # Variabel lingkungan production
```

---

## 3. Menyiapkan Lingkungan Lokal (Setup)

### A. Prasyarat
- Node.js versi 18.17 atau lebih baru (disarankan Node.js 20+).
- npm, pnpm, atau yarn.

### B. Instalasi Dependensi
```bash
npm install
```

### C. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan konfigurasi database Neon (`DATABASE_URL`), secret key Xendit (`XENDIT_SECRET_KEY`), token WhatsApp (`WA_API_TOKEN`), dan secret auth (`AUTH_SECRET`).

---

## 4. Manajemen Basis Data (Drizzle ORM)

Skema database didefinisikan secara deklaratif di `src/db/schema.ts`.

### A. Menghasilkan Migrasi Baru
Jika Anda mengubah skema tabel di `schema.ts`:
```bash
npx drizzle-kit generate
```

### B. Menjalankan Migrasi ke Database Neon
```bash
npx drizzle-kit migrate
```

### C. Mengisi Data Awal (Seeding)
Menjalankan script `src/db/seed.ts` untuk mengisi game, paket produk, tier joki, kupon diskon, akun admin, dan template notifikasi:
```bash
npx tsx -e "import('./src/db/seed').then(m => m.seed())"
```

---

## 5. Sistem Keamanan & Enkripsi

### A. Enkripsi Kredensial Akun Game (AES-256-GCM)
Kredensial login pembeli untuk layanan joki rank dienkripsi menggunakan fungsi di `src/lib/encryption.ts`:
```typescript
import { encryptData, decryptData } from "@/lib/encryption";

// Enkripsi sebelum disimpan ke DB (orders_joki.game_login_enc):
const cipherText = encryptData(JSON.stringify({ username, password, backupCode }));
// Format hasil: "iv_hex:auth_tag_hex:encrypted_hex"

// Dekripsi saat worker joki menekan tombol "Buka Kunci":
const plainText = decryptData(cipherText);
```

### B. Audit Log Immutable
Setiap aksi perubahan harga produk (`product_price`), perubahan status pembayaran, pembaruan progres joki, serta aksi membaca data sensitif (`READ_SENSITIVE`) **wajib** dicatat ke tabel `audit_logs`:
```typescript
import { writeAuditLog } from "@/lib/audit";

await writeAuditLog({
  actorId: user.id,
  actorRole: user.role,
  action: "READ_SENSITIVE",
  entityType: "joki_credentials",
  entityId: orderJokiId,
  referenceCode: invoiceId,
});
```
Fungsi `calculateDiff(before, after)` akan secara otomatis mengekstrak kunci-kunci yang mengalami perubahan dan menyimpannya dalam kolom `diff` (JSONB).

---

## 6. Integrasi Payment Gateway & Webhook

### A. Alur Transaksi Top-Up Otomatis
1. **User Checkout**: Memanggil `createOrderTopup` di `src/actions/orders.ts`.
2. **Invoice Dibuat**: Memanggil `createXenditInvoice` di `src/lib/xendit.ts`.
3. **Pembayaran Selesai**: Xendit memanggil webhook `POST /api/webhooks/xendit`.
4. **Validasi Token**: Sistem memvalidasi header `x-callback-token`.
5. **Idempotency**: Memeriksa tabel `payment_events`. Jika event sudah diproses sebelumnya, permintaan diabaikan dengan respons 200.
6. **Dispatch Supplier**: Sistem memanggil `dispatchSupplierOrder` di `src/lib/suppliers/dispatcher.ts`.
7. **Pengurangan Stok**: Mengurangi `products.stock` dan mencatat mutasi ke `stock_logs` (`reason='ORDER'`).
8. **Notifikasi WhatsApp**: Mengirim pesan sukses `TOPUP_SUCCESS` ke nomor pembeli.

### B. Verifikasi Transfer Manual
Bukti transfer manual diunggah ke `payment_proofs`. Admin memverifikasinya melalui action `verifyManualPayment` di `src/actions/payments.ts`:
- Status `PAID`: Order diproses ke supplier.
- Status `UNDERPAID`: Menandai kurang bayar.
- Status `REJECTED`: Ditolak disertai alasan (pembeli dapat melihat alasannya).

---

## 7. Realtime Layer (Server-Sent Events)

Alih-alih menggunakan websocket berbayar yang rumit, aplikasi menggunakan **Server-Sent Events (SSE)** bawaan Next.js App Router:
- **Streaming Chat Joki**: `GET /api/realtime/chat/[orderJokiId]`
- **Streaming Notifikasi**: `GET /api/realtime/notifications`

Pada sisi klien, browser cukup membuka koneksi sederhana:
```typescript
const eventSource = new EventSource(`/api/realtime/chat/${orderJokiId}`);
eventSource.onmessage = (event) => {
  const newMessages = JSON.parse(event.data);
  setMessages(newMessages);
};
```

---

## 8. Pengujian Otomatis (Testing)

Proyek dilengkapi dengan skrip uji asap otomatis (*automated smoke tests*) di `scripts/smoke-test.ts` untuk memvalidasi algoritma enkripsi, auto-diff audit log, validasi voucher diskon, kalkulator joki, pemformatan WhatsApp, token bucket rate limiter, dan verifikasi token Xendit.

Jalankan pengujian kapan saja dengan perintah:
```bash
npx tsx scripts/smoke-test.ts
```

Pastikan kompilasi Next.js lulus tanpa error:
```bash
npm run build
```

---

## 9. Panduan Deployment

### A. Deploy ke Vercel (Web Platform)
1. Unggah kode ke repositori GitHub Anda.
2. Impor repositori ke Vercel Dashboard.
3. Atur Environment Variables di menu *Settings > Environment Variables* sesuai berkas `.env.production.example`.
4. Berkas `vercel.json` secara otomatis mengonfigurasi cron jobs untuk:
   - `/api/cron/orders-expiry` (dijalankan tiap 5 menit).
   - `/api/cron/suppliers-sync` (dijalankan tiap 15 menit).
   - `/api/cron/retry-failed` (dijalankan tiap 10 menit).

### B. Build Mobile App (Expo EAS)
1. Masuk ke direktori mobile: `cd mobile`
2. Install EAS CLI: `npm install -g eas-cli`
3. Login ke akun Expo: `eas login`
4. Build APK Android:
   ```bash
   eas build --platform android --profile preview
   ```
5. Build untuk Google Play Store / Apple App Store:
   ```bash
   eas build --platform all --profile production
   ```
