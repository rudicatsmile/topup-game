// src/lib/wa.ts
// WhatsApp Gateway Service (Fonnte / Wablas abstraction with deduplication & audit logs)
import { db } from "@/db";
import { whatsappLogs, notificationTemplates } from "@/db/schema";
import { writeAuditLog } from "./audit";
import { eq, and } from "drizzle-orm";

export type NotificationEvent =
  | "ORDER_CREATED"
  | "ORDER_PAID"
  | "TOPUP_SUCCESS"
  | "JOKI_PROGRESS"
  | "JOKI_COMPLETED"
  | "REFUND_ISSUED";

export interface SendWhatsAppParams {
  userId?: string | null;
  phone: string;
  templateCode: NotificationEvent;
  variables: Record<string, string | number>;
  orderId?: string;
}

const DEFAULT_TEMPLATES: Record<NotificationEvent, string> = {
  ORDER_CREATED:
    "Halo {{name}}, pesanan {{invoiceId}} untuk {{gameName}} telah dibuat. Total bayar: Rp {{total}}. Segera selesaikan pembayaran sebelum {{expiresAt}}!",
  ORDER_PAID:
    "Terima kasih {{name}}! Pembayaran untuk {{invoiceId}} sebesar Rp {{total}} telah kami terima. Pesanan sedang segera diproses.",
  TOPUP_SUCCESS:
    "Hore {{name}}! Item {{productName}} untuk akun {{gameUserId}} berhasil masuk ke akun game kamu. Terima kasih telah top-up di TopUpGame!",
  JOKI_PROGRESS:
    "Halo {{name}}, joki rank kamu untuk {{invoiceId}} mencapai progress {{progressPercent}}% ({{currentTier}}). Pantau live chat di dashboard.",
  JOKI_COMPLETED:
    "Mantap {{name}}! Joki rank kamu untuk {{invoiceId}} telah SELESAI mencapai target {{targetTier}}. Silakan cek akun dan berikan rating bintang 5!",
  REFUND_ISSUED:
    "Halo {{name}}, dana pengembalian untuk pesanan {{invoiceId}} sebesar Rp {{total}} telah berhasil diproses ke saldo/rekening Anda.",
};

export function formatIndonesianPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

export function interpolateTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`;
  });
}

// In-memory deduplication cache: key = `${orderId}:${event}`
const sentEventCache = new Set<string>();

export async function sendWhatsAppNotification(params: SendWhatsAppParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  const formattedPhone = formatIndonesianPhone(params.phone);
  const dedupeKey = `${params.orderId || formattedPhone}:${params.templateCode}`;

  // 1. Deduplication check (prevents double sending on webhooks / retries)
  if (params.orderId && sentEventCache.has(dedupeKey)) {
    console.log(`[WhatsApp] Skipping duplicate event notification: ${dedupeKey}`);
    return { success: true, messageId: "cached_deduplicated" };
  }

  // 2. Fetch template text from DB or fallback to default
  let messageBody = DEFAULT_TEMPLATES[params.templateCode];
  try {
    const tpl = await db
      .select()
      .from(notificationTemplates)
      .where(and(eq(notificationTemplates.code, params.templateCode), eq(notificationTemplates.isActive, true)))
      .limit(1);

    if (tpl.length > 0 && tpl[0].body) {
      messageBody = tpl[0].body;
    }
  } catch {}

  const finalMessage = interpolateTemplate(messageBody, params.variables);
  const provider = process.env.WA_PROVIDER || "fonnte";
  const apiUrl = process.env.WA_API_URL || "https://api.fonnte.com/send";
  const apiToken = process.env.WA_API_TOKEN;

  let sendSuccess = false;
  let providerRef: string | undefined;
  let errorMessage: string | undefined;

  // 3. Dispatch to Gateway if real token is provided
  if (apiToken && !apiToken.includes("xxxxxxxx")) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: apiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: formattedPhone,
          message: finalMessage,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        sendSuccess = true;
        providerRef = resData.id || resData.message_id || "sent_ok";
      } else {
        errorMessage = `HTTP ${response.status}: ${await response.text()}`;
      }
    } catch (err: any) {
      errorMessage = err.message || "Failed to reach WhatsApp API";
    }
  } else {
    // Simulated successful delivery for development / demonstration
    sendSuccess = true;
    providerRef = `wa_sim_${Date.now()}`;
    console.log(`[WhatsApp SIMULATED -> ${formattedPhone}]: ${finalMessage}`);
  }

  if (params.orderId && sendSuccess) {
    sentEventCache.add(dedupeKey);
  }

  // 4. Log to whatsapp_logs table
  try {
    await db.insert(whatsappLogs).values({
      userId: params.userId || null,
      phone: formattedPhone,
      templateCode: params.templateCode,
      payload: { variables: params.variables, text: finalMessage },
      status: sendSuccess ? "SENT" : "FAILED",
      providerRef,
      errorMsg: errorMessage,
      attempt: 1,
    });
  } catch {}

  // 5. Write to immutable audit_logs as required by PRD
  await writeAuditLog({
    actorId: params.userId || null,
    actorRole: "system",
    action: "CREATE",
    entityType: "notification",
    referenceCode: params.templateCode,
    afterData: {
      phone: formattedPhone,
      templateCode: params.templateCode,
      status: sendSuccess ? "SENT" : "FAILED",
    },
  });

  return {
    success: sendSuccess,
    messageId: providerRef,
    error: errorMessage,
  };
}
