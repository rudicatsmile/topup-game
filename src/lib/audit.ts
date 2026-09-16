// src/lib/audit.ts
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { headers } from "next/headers";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "READ_SENSITIVE"
  | "LOGIN"
  | "LOGOUT";

export interface WriteAuditLogParams {
  actorId?: string | null;
  actorRole?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  referenceCode?: string | null;
  beforeData?: Record<string, any> | null;
  afterData?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Calculates shallow and nested key diffs between before and after states
 */
export function calculateDiff(
  before: Record<string, any> | null | undefined,
  after: Record<string, any> | null | undefined
): Record<string, { before: any; after: any }> | null {
  if (!before && !after) return null;
  if (!before) {
    const diff: Record<string, { before: any; after: any }> = {};
    for (const key in after) {
      diff[key] = { before: null, after: after[key] };
    }
    return diff;
  }
  if (!after) {
    const diff: Record<string, { before: any; after: any }> = {};
    for (const key in before) {
      diff[key] = { before: before[key], after: null };
    }
    return diff;
  }

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const diff: Record<string, { before: any; after: any }> = {};

  for (const key of allKeys) {
    const bVal = before[key];
    const aVal = after[key];
    if (JSON.stringify(bVal) !== JSON.stringify(aVal)) {
      diff[key] = { before: bVal, after: aVal };
    }
  }

  return Object.keys(diff).length > 0 ? diff : null;
}

/**
 * Writes an immutable record to audit_logs
 */
export async function writeAuditLog(params: WriteAuditLogParams) {
  try {
    let resolvedIp = params.ipAddress;
    let resolvedUa = params.userAgent;

    try {
      const headerList = await headers();
      if (!resolvedIp) {
        resolvedIp =
          headerList.get("x-forwarded-for")?.split(",")[0] ||
          headerList.get("x-real-ip") ||
          "127.0.0.1";
      }
      if (!resolvedUa) {
        resolvedUa = headerList.get("user-agent") || "unknown";
      }
    } catch {
      // In non-request context (e.g. background tasks or seeds)
      resolvedIp = resolvedIp || "127.0.0.1";
      resolvedUa = resolvedUa || "system";
    }

    const diff = calculateDiff(params.beforeData, params.afterData);

    const [record] = await db
      .insert(auditLogs)
      .values({
        actorId: params.actorId || null,
        actorRole: params.actorRole || "user",
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        referenceCode: params.referenceCode || null,
        beforeData: params.beforeData || null,
        afterData: params.afterData || null,
        diff: diff,
        ipAddress: resolvedIp,
        userAgent: resolvedUa,
      })
      .returning();

    return record;
  } catch (err) {
    console.error("Failed to write audit log:", err);
    // Audit log failures should be logged and not crash normal flow if db is unreachable
    return null;
  }
}
