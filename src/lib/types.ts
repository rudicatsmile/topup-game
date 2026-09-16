export type UserRole = "user" | "joki" | "admin" | "super_admin";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "EXPIRED"
  | "REFUNDED"
  | "CANCELLED";

export type JokiStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "QUEUED"
  | "ON_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "UNDERPAID"
  | "OVERPAID"
  | "FAILED"
  | "REFUNDED"
  | "EXPIRED";

export type PaymentMethod =
  | "XENDIT_QRIS"
  | "XENDIT_VA"
  | "XENDIT_EWALLET"
  | "XENDIT_RETAIL"
  | "MANUAL_TRANSFER"
  | "BALANCE";

export type StockReason = "SYNC" | "ORDER" | "REFUND" | "MANUAL" | "OPNAME";

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "READ_SENSITIVE" | "LOGIN" | "LOGOUT";

export interface GameItem {
  id: string;
  slug: string;
  name: string;
  publisher: string;
  category: "MOBA" | "FPS" | "Battle Royale" | "RPG" | "Strategy" | "Lainnya";
  platform: "Mobile" | "PC" | "Semua Platform";
  logoUrl: string;
  bannerUrl: string;
  needsZoneId: boolean;
  hasJoki: boolean;
  isActive: boolean;
  sortOrder: number;
  popular?: boolean;
}

export interface ProductItem {
  id: string;
  gameId: string;
  gameSlug?: string;
  sku: string;
  label: string;
  nominalQty: number;
  priceCost: number;
  priceSell: number;
  margin: number;
  stock: number;
  isActive: boolean;
  isPromo?: boolean;
  discountPercent?: number;
  sortOrder: number;
}

export interface JokiTierItem {
  id: string;
  gameId: string;
  gameSlug?: string;
  tierSlug: string;
  tierName: string;
  orderIndex: number;
  pricePerTier: number;
  estimatedMinutes: number;
}

export interface JokiWorkerItem {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  ratingAvg: number;
  ratingCount: number;
  skillGames: string[];
  isOnline: boolean;
  commissionPct: number;
  activeOrders: number;
}

export interface OrderTopupItem {
  id: string;
  invoiceId: string;
  userId: string;
  userName?: string;
  gameId: string;
  gameName: string;
  gameSlug: string;
  gameLogoUrl?: string;
  productId: string;
  productLabel: string;
  gameUserId: string;
  gameZoneId?: string;
  gameNickname?: string;
  qty: number;
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentMethodLabel?: string;
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
}

export interface OrderJokiItem {
  id: string;
  invoiceId: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  gameId: string;
  gameName: string;
  workerId?: string;
  workerName?: string;
  startTierName: string;
  targetTierName: string;
  currentTierName: string;
  accountEmail?: string;
  notes?: string;
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  etaMinutes: number;
  progressPercent: number;
  status: JokiStatus;
  paymentMethod: PaymentMethod;
  workerCommission?: number;
  createdAt: string;
}

export interface VoucherItem {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  maxDiscount?: number;
  minSpend: number;
  quotaTotal: number;
  quotaUsed: number;
  scope: "ALL" | "TOPUP" | "JOKI";
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface AuditLogItem {
  id: string;
  actorId?: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditAction;
  entityType: string;
  entityId: string;
  referenceCode: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
