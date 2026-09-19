// src/db/seed.ts
import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

export async function seed() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Users
  const [adminUser] = await db
    .insert(schema.users)
    .values([
      {
        email: "owner@topupgame.id",
        name: "Admin TopUpGame",
        phoneWa: "6281234567890",
        role: "super_admin",
        passwordHash,
      },
      {
        email: "worker.budi@topupgame.id",
        name: "Budi 'Ranger' Santoso",
        phoneWa: "6281298765432",
        role: "joki",
        passwordHash,
      },
      {
        email: "gamer.sultan@gmail.com",
        name: "Kevin Gamer",
        phoneWa: "6285712345678",
        role: "user",
        passwordHash,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // 2. Games
  const gamesData = [
    {
      slug: "mobile-legends",
      name: "Mobile Legends: Bang Bang",
      publisher: "Moonton",
      category: "MOBA",
      platform: "mobile",
      logoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
      needsZoneId: true,
      hasJoki: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      slug: "free-fire",
      name: "Free Fire Max",
      publisher: "Garena",
      category: "Battle Royale",
      platform: "mobile",
      logoUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80",
      needsZoneId: false,
      hasJoki: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      slug: "pubg-mobile",
      name: "PUBG Mobile",
      publisher: "Level Infinite",
      category: "Battle Royale",
      platform: "mobile",
      logoUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
      needsZoneId: false,
      hasJoki: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      slug: "valorant",
      name: "Valorant",
      publisher: "Riot Games",
      category: "FPS Tactical",
      platform: "pc",
      logoUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80",
      needsZoneId: false,
      hasJoki: true,
      isActive: true,
      sortOrder: 4,
    },
    {
      slug: "genshin-impact",
      name: "Genshin Impact",
      publisher: "HoYoverse",
      category: "Action RPG",
      platform: "both",
      logoUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=200&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1200&auto=format&fit=crop&q=80",
      needsZoneId: true,
      hasJoki: false,
      isActive: true,
      sortOrder: 5,
    },
  ];

  const insertedGames = await db
    .insert(schema.games)
    .values(gamesData)
    .onConflictDoNothing()
    .returning();

  // 3. Vouchers
  await db
    .insert(schema.vouchers)
    .values([
      {
        code: "HEMAT20",
        type: "PERCENT",
        value: "20.00",
        maxDiscount: "50000.00",
        minSpend: "50000.00",
        quotaTotal: 1000,
        quotaUsed: 142,
        perUserLimit: 2,
        scope: "ALL",
        validFrom: new Date("2025-01-01"),
        validUntil: new Date("2026-12-31"),
        isActive: true,
      },
      {
        code: "NEWUSER5K",
        type: "FIXED",
        value: "5000.00",
        maxDiscount: "5000.00",
        minSpend: "20000.00",
        quotaTotal: 5000,
        quotaUsed: 1205,
        perUserLimit: 1,
        scope: "TOPUP",
        validFrom: new Date("2025-01-01"),
        validUntil: new Date("2026-12-31"),
        isActive: true,
      },
      {
        code: "JOKISULTAN",
        type: "PERCENT",
        value: "15.00",
        maxDiscount: "100000.00",
        minSpend: "150000.00",
        quotaTotal: 200,
        quotaUsed: 44,
        perUserLimit: 1,
        scope: "JOKI",
        validFrom: new Date("2025-01-01"),
        validUntil: new Date("2026-12-31"),
        isActive: true,
      },
    ])
    .onConflictDoNothing();

  // 4. Notification Templates
  await db
    .insert(schema.notificationTemplates)
    .values([
      {
        code: "ORDER_CREATED",
        channel: "WHATSAPP",
        subject: "Pesanan Dibuat",
        body: "Halo {{name}}, pesanan {{invoiceId}} untuk {{gameName}} telah dibuat. Total bayar: Rp {{total}}. Segera selesaikan pembayaran sebelum {{expiresAt}}!",
        isActive: true,
      },
      {
        code: "ORDER_PAID",
        channel: "WHATSAPP",
        subject: "Pembayaran Diterima",
        body: "Terima kasih {{name}}! Pembayaran untuk {{invoiceId}} sebesar Rp {{total}} telah kami terima. Pesanan sedang diproses.",
        isActive: true,
      },
      {
        code: "TOPUP_SUCCESS",
        channel: "WHATSAPP",
        subject: "Top Up Berhasil",
        body: "Hore! Item {{productName}} untuk akun {{gameUserId}} berhasil masuk ke akun game kamu. Terima kasih telah memilih TopUpGame!",
        isActive: true,
      },
      {
        code: "JOKI_PROGRESS",
        channel: "WHATSAPP",
        subject: "Update Progress Joki",
        body: "Halo {{name}}, joki kamu untuk {{invoiceId}} mencapai progress {{progressPercent}}% ({{currentTier}}). Pantau live chat di dashboard.",
        isActive: true,
      },
      {
        code: "JOKI_COMPLETED",
        channel: "WHATSAPP",
        subject: "Joki Selesai",
        body: "Mantap {{name}}! Joki rank kamu telah selesai mencapai target {{targetTier}}. Silakan cek akun dan berikan rating untuk penjoki kamu.",
        isActive: true,
      },
    ])
    .onConflictDoNothing();

  // 5. Settings
  await db
    .insert(schema.settings)
    .values([
      {
        key: "store_config",
        value: {
          storeName: "TopUpGame Indonesia",
          csPhone: "081234567890",
          csEmail: "support@topupgame.id",
          maintenanceMode: false,
          xenditMode: "sandbox",
          manualBank: {
            bankName: "BCA",
            accountNumber: "1234567890",
            accountHolder: "PT TopUpGame Indonesia",
          },
        },
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Database seeded successfully!");
}

if (process.argv[1]?.includes("seed")) {
  seed()
    .then(() => {
      console.log("Seeding finished.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}
