// src/db/schema.ts — TopUpGame (Drizzle ORM, PostgreSQL)
// Strictly follows PRD Bab 10
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
  smallint,
} from "drizzle-orm/pg-core";

// ============ ENUMS ============
export const userRoleEnum = pgEnum("user_role", ["user", "joki", "admin", "super_admin"]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "EXPIRED",
  "REFUNDED",
  "CANCELLED",
]);
export const jokiStatusEnum = pgEnum("joki_status", [
  "PENDING_PAYMENT",
  "PAID",
  "QUEUED",
  "ON_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "UNDERPAID",
  "OVERPAID",
  "FAILED",
  "REFUNDED",
  "EXPIRED",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "XENDIT_QRIS",
  "XENDIT_VA",
  "XENDIT_EWALLET",
  "XENDIT_RETAIL",
  "MANUAL_TRANSFER",
  "BALANCE",
]);
export const stockReasonEnum = pgEnum("stock_reason", ["SYNC", "ORDER", "REFUND", "MANUAL", "OPNAME"]);
export const auditActionEnum = pgEnum("audit_action", [
  "CREATE",
  "UPDATE",
  "DELETE",
  "READ_SENSITIVE",
  "LOGIN",
  "LOGOUT",
]);

// ============ USERS & AUTH ============
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    name: varchar("name", { length: 120 }).notNull(),
    phoneWa: varchar("phone_wa", { length: 20 }).notNull(),
    avatarUrl: text("avatar_url"),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").default("user").notNull(),
    points: integer("points").default(0).notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    phoneIdx: index("users_phone_idx").on(t.phoneWa),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    userAgent: text("user_agent"),
    ipAddress: varchar("ip_address", { length: 64 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    sessionTokenIdx: uniqueIndex("sessions_token_idx").on(t.tokenHash),
  })
);

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

// ============ CATALOG ============
export const games = pgTable(
  "games",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    publisher: varchar("publisher", { length: 120 }).notNull(),
    category: varchar("category", { length: 60 }).notNull(), // MOBA, FPS, BR, RPG...
    platform: varchar("platform", { length: 40 }).notNull(), // mobile, pc, both
    logoUrl: text("logo_url"),
    bannerUrl: text("banner_url"),
    needsZoneId: boolean("needs_zone_id").default(false).notNull(),
    hasJoki: boolean("has_joki").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("games_slug_idx").on(t.slug),
  })
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 80 }).notNull(),
    label: varchar("label", { length: 120 }).notNull(), // e.g. "86 Diamond"
    nominalQty: integer("nominal_qty").notNull(),
    priceCost: numeric("price_cost", { precision: 12, scale: 2 }).notNull(),
    priceSell: numeric("price_sell", { precision: 12, scale: 2 }).notNull(),
    margin: numeric("margin", { precision: 12, scale: 2 }).notNull(),
    stock: integer("stock").default(0).notNull(),
    supplierId: uuid("supplier_id"),
    supplierSku: varchar("supplier_sku", { length: 120 }),
    isActive: boolean("is_active").default(true).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    skuIdx: uniqueIndex("products_sku_idx").on(t.sku),
    gameIdx: index("products_game_idx").on(t.gameId),
  })
);

export const suppliers = pgTable("suppliers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  baseUrl: text("base_url").notNull(),
  apiKeyEnc: text("api_key_enc").notNull(), // AES-256-GCM
  isActive: boolean("is_active").default(true).notNull(),
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const stockLogs = pgTable(
  "stock_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    beforeQty: integer("before_qty").notNull(),
    afterQty: integer("after_qty").notNull(),
    reason: stockReasonEnum("reason").notNull(),
    refId: uuid("ref_id"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    productIdx: index("stock_logs_product_idx").on(t.productId),
  })
);

// ============ JOKI RANK CATALOG ============
export const jokiTiers = pgTable(
  "joki_tiers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    tierSlug: varchar("tier_slug", { length: 80 }).notNull(), // "epic-v", "legend-v"
    tierName: varchar("tier_name", { length: 80 }).notNull(),
    orderIndex: integer("order_index").notNull(), // urutan rank 1..N
    pricePerTier: numeric("price_per_tier", { precision: 12, scale: 2 }).notNull(),
    estimatedMin: integer("estimated_minutes").notNull(),
  },
  (t) => ({
    gameTierIdx: uniqueIndex("joki_tier_unique_idx").on(t.gameId, t.tierSlug),
  })
);

export const jokiWorkers = pgTable("joki_workers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 }).default("5.00").notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
  skillGameIds: jsonb("skill_game_ids").$type<string[]>().default([]).notNull(),
  isOnline: boolean("is_online").default(false).notNull(),
  commissionPct: numeric("commission_pct", { precision: 5, scale: 2 }).default("70.00").notNull(),
  activeOrders: integer("active_orders").default(0).notNull(),
});

// ============ ORDERS (TOP-UP) ============
export const ordersTopup = pgTable(
  "orders_topup",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: varchar("invoice_id", { length: 40 }).notNull(), // TUG-YYYY-XXXXXX
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    gameUserId: varchar("game_user_id", { length: 80 }).notNull(),
    gameZoneId: varchar("game_zone_id", { length: 80 }),
    gameNickname: varchar("game_nickname", { length: 120 }),
    qty: integer("qty").default(1).notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 12, scale: 2 }).default("0").notNull(),
    fee: numeric("fee", { precision: 12, scale: 2 }).default("0").notNull(),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    voucherId: uuid("voucher_id"),
    status: orderStatusEnum("status").default("PENDING_PAYMENT").notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    supplierRef: varchar("supplier_ref", { length: 120 }),
    supplierResp: jsonb("supplier_resp"),
    retryCount: integer("retry_count").default(0).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    invoiceIdx: uniqueIndex("orders_topup_invoice_idx").on(t.invoiceId),
    userIdx: index("orders_topup_user_idx").on(t.userId, t.createdAt),
    statusIdx: index("orders_topup_status_idx").on(t.status),
  })
);

// ============ ORDERS (JOKI) ============
export const ordersJoki = pgTable(
  "orders_joki",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceId: varchar("invoice_id", { length: 40 }).notNull(), // TUG-JKI-YYYY-XXXXXX
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "restrict" }),
    workerId: uuid("worker_id").references(() => jokiWorkers.id, { onDelete: "set null" }),
    startTierId: uuid("start_tier_id")
      .notNull()
      .references(() => jokiTiers.id),
    targetTierId: uuid("target_tier_id")
      .notNull()
      .references(() => jokiTiers.id),
    currentTierId: uuid("current_tier_id").references(() => jokiTiers.id),
    gameLoginEnc: text("game_login_enc").notNull(), // AES-256-GCM (JSON: username,password,backupCode)
    accountEmail: varchar("account_email", { length: 200 }),
    notes: text("notes"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 12, scale: 2 }).default("0").notNull(),
    fee: numeric("fee", { precision: 12, scale: 2 }).default("0").notNull(),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    voucherId: uuid("voucher_id"),
    etaMinutes: integer("eta_minutes").notNull(),
    status: jokiStatusEnum("status").default("PENDING_PAYMENT").notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    progressPercent: smallint("progress_percent").default(0).notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    workerCommission: numeric("worker_commission", { precision: 12, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    invoiceIdx: uniqueIndex("orders_joki_invoice_idx").on(t.invoiceId),
    userIdx: index("orders_joki_user_idx").on(t.userId, t.createdAt),
    workerIdx: index("orders_joki_worker_idx").on(t.workerId, t.status),
  })
);

// ============ PAYMENTS (XENDIT + MANUAL) ============
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referenceType: varchar("reference_type", { length: 20 }).notNull(), // 'topup' | 'joki'
    referenceId: uuid("reference_id").notNull(),
    method: paymentMethodEnum("method").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    feeAmount: numeric("fee_amount", { precision: 12, scale: 2 }).default("0").notNull(),
    status: paymentStatusEnum("status").default("PENDING").notNull(),
    externalId: varchar("external_id", { length: 120 }), // Xendit invoice id / reference
    xenditPaymentId: varchar("xendit_payment_id", { length: 120 }),
    xenditMethod: varchar("xendit_method", { length: 60 }), // QRIS/BCA/OVO...
    vaNumber: varchar("va_number", { length: 60 }),
    qrString: text("qr_string"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    rawPayload: jsonb("raw_payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    refIdx: index("payments_ref_idx").on(t.referenceType, t.referenceId),
    externalIdx: index("payments_external_idx").on(t.externalId),
  })
);

export const paymentProofs = pgTable("payment_proofs", {
  id: uuid("id").defaultRandom().primaryKey(),
  paymentId: uuid("payment_id")
    .notNull()
    .references(() => payments.id, { onDelete: "cascade" }),
  fileUrl: text("file_url").notNull(),
  fileSha256: varchar("file_sha256", { length: 64 }).notNull(),
  uploadedBy: uuid("uploaded_by")
    .notNull()
    .references(() => users.id),
  verifiedBy: uuid("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  rejectReason: text("reject_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const paymentEvents = pgTable(
  "payment_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    externalId: varchar("external_id", { length: 120 }).notNull(),
    eventType: varchar("event_type", { length: 60 }).notNull(),
    referenceType: varchar("reference_type", { length: 20 }),
    referenceId: uuid("reference_id"),
    payload: jsonb("payload").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    extUniq: uniqueIndex("payment_events_external_idx").on(t.externalId, t.eventType),
  })
);

// ============ VOUCHERS ============
export const vouchers = pgTable(
  "vouchers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 40 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(), // PERCENT | FIXED
    value: numeric("value", { precision: 12, scale: 2 }).notNull(),
    maxDiscount: numeric("max_discount", { precision: 12, scale: 2 }),
    minSpend: numeric("min_spend", { precision: 12, scale: 2 }).default("0").notNull(),
    quotaTotal: integer("quota_total").notNull(),
    quotaUsed: integer("quota_used").default(0).notNull(),
    perUserLimit: integer("per_user_limit").default(1).notNull(),
    scope: varchar("scope", { length: 20 }).default("ALL").notNull(), // ALL|TOPUP|JOKI
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validUntil: timestamp("valid_until", { withTimezone: true }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    codeIdx: uniqueIndex("vouchers_code_idx").on(t.code),
  })
);

export const voucherUsages = pgTable("voucher_usages", {
  id: uuid("id").defaultRandom().primaryKey(),
  voucherId: uuid("voucher_id")
    .notNull()
    .references(() => vouchers.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  referenceType: varchar("reference_type", { length: 20 }).notNull(),
  referenceId: uuid("reference_id").notNull(),
  discountValue: numeric("discount_value", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============ CHAT JOKI <-> USER ============
export const chatRooms = pgTable(
  "chat_rooms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderJokiId: uuid("order_joki_id")
      .notNull()
      .references(() => ordersJoki.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orderUniq: uniqueIndex("chat_rooms_order_idx").on(t.orderJokiId),
  })
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => chatRooms.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id),
    senderRole: userRoleEnum("sender_role").notNull(),
    body: text("body"),
    attachmentUrl: text("attachment_url"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    roomIdx: index("chat_messages_room_idx").on(t.roomId, t.createdAt),
  })
);

export const jokiProgressLogs = pgTable("joki_progress_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderJokiId: uuid("order_joki_id")
    .notNull()
    .references(() => ordersJoki.id, { onDelete: "cascade" }),
  fromTierId: uuid("from_tier_id").references(() => jokiTiers.id),
  toTierId: uuid("to_tier_id").references(() => jokiTiers.id),
  progressPercent: smallint("progress_percent").notNull(),
  screenshotUrl: text("screenshot_url"),
  note: text("note"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============ NOTIFICATIONS (WHATSAPP + IN-APP) ============
export const notificationTemplates = pgTable(
  "notification_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 60 }).notNull(), // ORDER_PAID, JOKI_PROGRESS, ...
    channel: varchar("channel", { length: 20 }).default("WHATSAPP").notNull(),
    subject: varchar("subject", { length: 160 }),
    body: text("body").notNull(), // template with {{var}}
    isActive: boolean("is_active").default(true).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    codeIdx: uniqueIndex("notif_tpl_code_idx").on(t.code, t.channel),
  })
);

export const whatsappLogs = pgTable(
  "whatsapp_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    phone: varchar("phone", { length: 20 }).notNull(),
    templateCode: varchar("template_code", { length: 60 }).notNull(),
    payload: jsonb("payload"),
    status: varchar("status", { length: 20 }).notNull(), // SENT|FAILED|QUEUED
    providerRef: varchar("provider_ref", { length: 120 }),
    errorMsg: text("error_msg"),
    attempt: smallint("attempt").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("wa_logs_user_idx").on(t.userId, t.createdAt),
  })
);

export const inAppNotifications = pgTable(
  "in_app_notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 160 }).notNull(),
    body: text("body").notNull(),
    link: text("link"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("inapp_user_idx").on(t.userId, t.readAt),
  })
);

// ============ AUDIT LOG (IMMUTABLE) ============
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    actorRole: varchar("actor_role", { length: 30 }),
    action: auditActionEnum("action").notNull(),
    entityType: varchar("entity_type", { length: 60 }).notNull(), // order_topup|order_joki|payment|product_price|stock|user|...
    entityId: uuid("entity_id"),
    referenceCode: varchar("reference_code", { length: 80 }),
    beforeData: jsonb("before_data"),
    afterData: jsonb("after_data"),
    diff: jsonb("diff"),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    entityIdx: index("audit_entity_idx").on(t.entityType, t.entityId, t.createdAt),
    actorIdx: index("audit_actor_idx").on(t.actorId, t.createdAt),
  })
);

// ============ REVIEWS & SETTINGS ============
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referenceType: varchar("reference_type", { length: 20 }).notNull(), // topup|joki
  referenceId: uuid("reference_id").notNull(),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
