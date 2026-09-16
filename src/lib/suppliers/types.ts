// src/lib/suppliers/types.ts

export interface SupplierOrderRequest {
  refId: string;
  sku: string;
  gameUserId: string;
  gameZoneId?: string | null;
  server?: string;
}

export interface SupplierOrderResponse {
  success: boolean;
  supplierRef: string;
  status: "PROCESSING" | "SUCCESS" | "FAILED";
  message: string;
  raw?: any;
}

export interface SupplierPriceItem {
  sku: string;
  name: string;
  priceCost: number;
  stock: number;
  isActive: boolean;
}
