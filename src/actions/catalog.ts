// src/actions/catalog.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { encryptData } from "@/lib/encryption";
import { z } from "zod";
import { DUMMY_GAMES, DUMMY_PRODUCTS, DUMMY_VOUCHERS } from "@/lib/dummy-data";

// ============ GAME SCHEMAS & ACTIONS ============
const gameSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  publisher: z.string().min(2),
  category: z.string().min(2),
  platform: z.enum(["mobile", "pc", "both"]),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  needsZoneId: z.boolean().default(false),
  hasJoki: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export async function getGames() {
  try {
    const list = await db.select().from(schema.games).orderBy(schema.games.sortOrder);
    if (list.length > 0) return list;
  } catch {}
  return DUMMY_GAMES;
}

export async function createGame(formData: z.infer<typeof gameSchema>) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = gameSchema.parse(formData);

  const [created] = await db
    .insert(schema.games)
    .values({
      slug: parsed.slug,
      name: parsed.name,
      publisher: parsed.publisher,
      category: parsed.category,
      platform: parsed.platform,
      logoUrl: parsed.logoUrl,
      bannerUrl: parsed.bannerUrl,
      needsZoneId: parsed.needsZoneId,
      hasJoki: parsed.hasJoki,
      isActive: parsed.isActive,
      sortOrder: parsed.sortOrder,
    })
    .returning();

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "CREATE",
    entityType: "game",
    entityId: created?.id,
    referenceCode: parsed.slug,
    afterData: parsed,
  });

  revalidatePath("/admin/games");
  revalidatePath("/top-up");
  revalidatePath("/");
  return { success: true, game: created };
}

export async function updateGame(id: string, formData: Partial<z.infer<typeof gameSchema>>) {
  const user = await requireRole(["admin", "super_admin"]);

  const [before] = await db.select().from(schema.games).where(eq(schema.games.id, id)).limit(1);

  const [updated] = await db
    .update(schema.games)
    .set({ ...formData })
    .where(eq(schema.games.id, id))
    .returning();

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "UPDATE",
    entityType: "game",
    entityId: id,
    referenceCode: updated?.slug || id,
    beforeData: before || null,
    afterData: updated || formData,
  });

  revalidatePath("/admin/games");
  revalidatePath("/top-up");
  return { success: true, game: updated };
}

export async function deleteGame(id: string) {
  const user = await requireRole(["admin", "super_admin"]);

  const [before] = await db.select().from(schema.games).where(eq(schema.games.id, id)).limit(1);

  await db.delete(schema.games).where(eq(schema.games.id, id));

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "DELETE",
    entityType: "game",
    entityId: id,
    referenceCode: before?.slug || id,
    beforeData: before || null,
  });

  revalidatePath("/admin/games");
  revalidatePath("/top-up");
  revalidatePath("/");
  return { success: true };
}

// ============ PRODUCT SCHEMAS & ACTIONS ============
const productSchema = z.object({
  gameId: z.string().uuid(),
  sku: z.string().min(2),
  label: z.string().min(2),
  nominalQty: z.number().int().positive(),
  priceCost: z.number().positive(),
  priceSell: z.number().positive(),
  stock: z.number().int().nonnegative().default(100),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export async function getProducts(gameId?: string) {
  try {
    if (gameId) {
      const list = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.gameId, gameId))
        .orderBy(schema.products.sortOrder);
      if (list.length > 0) return list;
    } else {
      const list = await db.select().from(schema.products).orderBy(schema.products.sortOrder);
      if (list.length > 0) return list;
    }
  } catch {}
  return DUMMY_PRODUCTS;
}

export async function createProduct(formData: z.infer<typeof productSchema>) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = productSchema.parse(formData);

  if (parsed.priceSell < parsed.priceCost) {
    throw new Error("Harga jual tidak boleh lebih rendah dari harga modal!");
  }

  const margin = parsed.priceSell - parsed.priceCost;

  const [created] = await db
    .insert(schema.products)
    .values({
      gameId: parsed.gameId,
      sku: parsed.sku,
      label: parsed.label,
      nominalQty: parsed.nominalQty,
      priceCost: parsed.priceCost.toFixed(2),
      priceSell: parsed.priceSell.toFixed(2),
      margin: margin.toFixed(2),
      stock: parsed.stock,
      isActive: parsed.isActive,
      sortOrder: parsed.sortOrder,
    })
    .returning();

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "CREATE",
    entityType: "product",
    entityId: created?.id,
    referenceCode: parsed.sku,
    afterData: parsed,
  });

  revalidatePath("/admin/products");
  return { success: true, product: created };
}

export async function updateProduct(id: string, formData: Partial<z.infer<typeof productSchema>>) {
  const user = await requireRole(["admin", "super_admin"]);

  const [before] = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);

  const isPriceChanged =
    (formData.priceCost !== undefined && Number(before?.priceCost) !== formData.priceCost) ||
    (formData.priceSell !== undefined && Number(before?.priceSell) !== formData.priceSell);

  const sell = formData.priceSell ?? Number(before?.priceSell || 0);
  const cost = formData.priceCost ?? Number(before?.priceCost || 0);
  const margin = sell - cost;

  const [updated] = await db
    .update(schema.products)
    .set({
      ...formData,
      priceCost: formData.priceCost !== undefined ? formData.priceCost.toFixed(2) : undefined,
      priceSell: formData.priceSell !== undefined ? formData.priceSell.toFixed(2) : undefined,
      margin: margin.toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(schema.products.id, id))
    .returning();

  // If price changed, explicitly write audit log with entity_type='product_price' as per PRD Task 2.4
  if (isPriceChanged) {
    await writeAuditLog({
      actorId: user.userId,
      actorRole: user.role,
      action: "UPDATE",
      entityType: "product_price",
      entityId: id,
      referenceCode: updated?.sku || id,
      beforeData: { priceCost: before?.priceCost, priceSell: before?.priceSell },
      afterData: { priceCost: updated?.priceCost, priceSell: updated?.priceSell },
    });
  } else {
    await writeAuditLog({
      actorId: user.userId,
      actorRole: user.role,
      action: "UPDATE",
      entityType: "product",
      entityId: id,
      referenceCode: updated?.sku || id,
      beforeData: before || null,
      afterData: updated || formData,
    });
  }

  revalidatePath("/admin/products");
  return { success: true, product: updated };
}

export async function deleteProduct(id: string) {
  const user = await requireRole(["admin", "super_admin"]);

  const [before] = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);

  await db.delete(schema.products).where(eq(schema.products.id, id));

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "DELETE",
    entityType: "product",
    entityId: id,
    referenceCode: before?.sku || id,
    beforeData: before || null,
  });

  revalidatePath("/admin/products");
  return { success: true };
}

// ============ VOUCHER SCHEMAS & ACTIONS ============
export async function validateVoucher(code: string, subtotal: number, scope: "TOPUP" | "JOKI" | "ALL") {
  const cleanCode = code.toUpperCase().trim();
  let voucher;

  try {
    const list = await db
      .select()
      .from(schema.vouchers)
      .where(and(eq(schema.vouchers.code, cleanCode), eq(schema.vouchers.isActive, true)))
      .limit(1);
    voucher = list[0];
  } catch {}

  // Fallback to dummy vouchers
  if (!voucher) {
    const dummy = DUMMY_VOUCHERS.find((v) => v.code === cleanCode && v.isActive);
    if (!dummy) {
      return { valid: false, error: "Kode voucher tidak ditemukan atau tidak aktif." };
    }
    voucher = {
      id: dummy.id,
      code: dummy.code,
      type: dummy.type,
      value: dummy.value.toString(),
      maxDiscount: dummy.maxDiscount?.toString() || null,
      minSpend: dummy.minSpend.toString(),
      quotaTotal: dummy.quotaTotal,
      quotaUsed: dummy.quotaUsed,
      scope: dummy.scope,
      validUntil: new Date(dummy.validUntil),
    };
  }

  if (new Date() > new Date(voucher.validUntil)) {
    return { valid: false, error: "Voucher telah kadaluwarsa." };
  }

  if (voucher.quotaUsed >= voucher.quotaTotal) {
    return { valid: false, error: "Kuota voucher telah habis." };
  }

  if (subtotal < Number(voucher.minSpend)) {
    return {
      valid: false,
      error: `Minimal transaksi untuk voucher ini adalah Rp ${Number(voucher.minSpend).toLocaleString("id-ID")}`,
    };
  }

  if (voucher.scope !== "ALL" && voucher.scope !== scope) {
    return {
      valid: false,
      error: `Voucher ini hanya berlaku untuk kategori ${voucher.scope === "TOPUP" ? "Top Up" : "Joki Rank"}.`,
    };
  }

  let discountAmount = 0;
  if (voucher.type === "PERCENT") {
    discountAmount = (subtotal * Number(voucher.value)) / 100;
    if (voucher.maxDiscount && discountAmount > Number(voucher.maxDiscount)) {
      discountAmount = Number(voucher.maxDiscount);
    }
  } else {
    discountAmount = Number(voucher.value);
  }

  return {
    valid: true,
    voucherId: voucher.id,
    code: voucher.code,
    discountAmount: Math.round(discountAmount),
  };
}

export async function getVouchers() {
  try {
    const list = await db.select().from(schema.vouchers).orderBy(schema.vouchers.createdAt);
    if (list.length > 0) {
      return list.map((v) => ({
        id: v.id,
        code: v.code,
        type: v.type as "PERCENT" | "FIXED",
        value: Number(v.value),
        maxDiscount: v.maxDiscount ? Number(v.maxDiscount) : undefined,
        minSpend: Number(v.minSpend),
        quotaTotal: v.quotaTotal,
        quotaUsed: v.quotaUsed,
        scope: v.scope as "ALL" | "TOPUP" | "JOKI",
        validFrom: v.validFrom ? new Date(v.validFrom).toISOString() : new Date().toISOString(),
        validUntil: v.validUntil ? new Date(v.validUntil).toISOString() : new Date().toISOString(),
        isActive: v.isActive,
      }));
    }
  } catch {}
  return DUMMY_VOUCHERS;
}

export async function createVoucher(data: {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscount?: number;
  minSpend?: number;
  quotaTotal?: number;
  scope?: "ALL" | "TOPUP" | "JOKI";
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
}) {
  const user = await requireRole(["admin", "super_admin"]);
  const cleanCode = data.code.toUpperCase().trim();

  const [created] = await db
    .insert(schema.vouchers)
    .values({
      code: cleanCode,
      type: data.type,
      value: data.value.toFixed(2),
      maxDiscount: data.maxDiscount !== undefined ? data.maxDiscount.toFixed(2) : undefined,
      minSpend: data.minSpend !== undefined ? data.minSpend.toFixed(2) : "0",
      quotaTotal: data.quotaTotal ?? 500,
      quotaUsed: 0,
      scope: data.scope ?? "ALL",
      validFrom: data.validFrom || new Date(),
      validUntil: data.validUntil || new Date(Date.now() + 30 * 86400000),
      isActive: data.isActive ?? true,
    })
    .returning();

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "CREATE",
    entityType: "voucher",
    entityId: created?.id,
    referenceCode: cleanCode,
    afterData: data,
  });

  revalidatePath("/admin/vouchers");
  return { success: true, voucher: created };
}

export async function updateVoucher(
  id: string,
  data: Partial<{
    code: string;
    type: "PERCENT" | "FIXED";
    value: number;
    maxDiscount?: number;
    minSpend?: number;
    quotaTotal?: number;
    scope?: "ALL" | "TOPUP" | "JOKI";
    validFrom?: Date;
    validUntil?: Date;
    isActive?: boolean;
  }>
) {
  const user = await requireRole(["admin", "super_admin"]);

  const [before] = await db.select().from(schema.vouchers).where(eq(schema.vouchers.id, id)).limit(1);

  const [updated] = await db
    .update(schema.vouchers)
    .set({
      code: data.code !== undefined ? data.code.toUpperCase().trim() : undefined,
      type: data.type,
      value: data.value !== undefined ? data.value.toFixed(2) : undefined,
      maxDiscount: data.maxDiscount !== undefined ? (data.maxDiscount ? data.maxDiscount.toFixed(2) : null) : undefined,
      minSpend: data.minSpend !== undefined ? data.minSpend.toFixed(2) : undefined,
      quotaTotal: data.quotaTotal,
      scope: data.scope,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      isActive: data.isActive,
    })
    .where(eq(schema.vouchers.id, id))
    .returning();

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "UPDATE",
    entityType: "voucher",
    entityId: id,
    referenceCode: updated?.code || id,
    beforeData: before || null,
    afterData: updated || data,
  });

  revalidatePath("/admin/vouchers");
  return { success: true, voucher: updated };
}

export async function deleteVoucher(id: string) {
  const user = await requireRole(["admin", "super_admin"]);

  const [before] = await db.select().from(schema.vouchers).where(eq(schema.vouchers.id, id)).limit(1);

  await db.delete(schema.vouchers).where(eq(schema.vouchers.id, id));

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "DELETE",
    entityType: "voucher",
    entityId: id,
    referenceCode: before?.code || id,
    beforeData: before || null,
  });

  revalidatePath("/admin/vouchers");
  return { success: true };
}

// ============ SUPPLIERS ACTIONS ============
export async function createSupplier(data: { name: string; baseUrl: string; apiKey: string }) {
  const user = await requireRole(["admin", "super_admin"]);
  const apiKeyEnc = encryptData(data.apiKey);

  const [created] = await db
    .insert(schema.suppliers)
    .values({
      name: data.name,
      baseUrl: data.baseUrl,
      apiKeyEnc,
      isActive: true,
    })
    .returning();

  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "CREATE",
    entityType: "supplier",
    entityId: created?.id,
    referenceCode: data.name,
  });

  revalidatePath("/admin/suppliers");
  return { success: true, supplier: created };
}

export async function getSuppliers() {
  try {
    const list = await db.select().from(schema.suppliers).orderBy(schema.suppliers.createdAt);
    if (list.length > 0) {
      return list.map((s) => ({
        id: s.id,
        name: s.name,
        baseUrl: s.baseUrl,
        apiKeyMasked: "••••••••••••" + (s.id ? s.id.slice(-4) : "key"),
        isActive: s.isActive,
        lastSync: s.lastSyncAt ? new Date(s.lastSyncAt).toLocaleDateString("id-ID") : "Belum pernah",
        balance: 0,
        status: s.isActive ? "TERKONEKSI" : "STANDBY",
      }));
    }
  } catch {}
  return [];
}

export async function deleteSupplier(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  const [before] = await db.select().from(schema.suppliers).where(eq(schema.suppliers.id, id)).limit(1);
  await db.delete(schema.suppliers).where(eq(schema.suppliers.id, id));
  await writeAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "DELETE",
    entityType: "supplier",
    entityId: id,
    referenceCode: before?.name || id,
  });
  revalidatePath("/admin/suppliers");
  return { success: true };
}

