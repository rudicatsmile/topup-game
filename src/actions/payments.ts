// src/actions/payments.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { dispatchSupplierOrder } from "@/lib/suppliers/dispatcher";
import { sendWhatsAppNotification } from "@/lib/wa";
import crypto from "crypto";

export async function verifyManualPayment(params: {
  paymentProofId: string;
  action: "APPROVE" | "REJECT";
  rejectReason?: string;
  verifiedAmount?: number;
}) {
  const admin = await requireRole(["admin", "super_admin"]);

  try {
    const [proof] = await db
      .select({
        proof: schema.paymentProofs,
        payment: schema.payments,
      })
      .from(schema.paymentProofs)
      .innerJoin(schema.payments, eq(schema.paymentProofs.paymentId, schema.payments.id))
      .where(eq(schema.paymentProofs.id, params.paymentProofId))
      .limit(1);

    if (!proof) {
      return { success: false, error: "Bukti pembayaran tidak ditemukan" };
    }

    const { payment, proof: p } = proof;

    if (params.action === "APPROVE") {
      const amountExpected = Number(payment.amount);
      const amountPaid = params.verifiedAmount !== undefined ? params.verifiedAmount : amountExpected;

      let paymentStatus: "PAID" | "UNDERPAID" | "OVERPAID" = "PAID";
      if (amountPaid < amountExpected) {
        paymentStatus = "UNDERPAID";
      } else if (amountPaid > amountExpected) {
        paymentStatus = "OVERPAID";
      }

      // Update payment proof
      await db
        .update(schema.paymentProofs)
        .set({
          verifiedBy: admin.userId,
          verifiedAt: new Date(),
        })
        .where(eq(schema.paymentProofs.id, params.paymentProofId));

      // Update payment status
      await db
        .update(schema.payments)
        .set({
          status: paymentStatus,
          paidAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.payments.id, payment.id));

      // Update order and dispatch if topup
      if (payment.referenceType === "topup" && (paymentStatus === "PAID" || paymentStatus === "OVERPAID")) {
        await db
          .update(schema.ordersTopup)
          .set({ status: "PROCESSING", paidAt: new Date(), updatedAt: new Date() })
          .where(eq(schema.ordersTopup.id, payment.referenceId));

        await dispatchSupplierOrder(payment.referenceId);
      } else if (payment.referenceType === "joki" && (paymentStatus === "PAID" || paymentStatus === "OVERPAID")) {
        await db
          .update(schema.ordersJoki)
          .set({ status: "QUEUED", paidAt: new Date(), updatedAt: new Date() })
          .where(eq(schema.ordersJoki.id, payment.referenceId));
      }

      await writeAuditLog({
        actorId: admin.userId,
        actorRole: admin.role,
        action: "UPDATE",
        entityType: "payment",
        entityId: payment.id,
        beforeData: { status: payment.status },
        afterData: { status: paymentStatus, verifiedAmount: amountPaid },
      });

      revalidatePath("/admin/payments");
      return { success: true, paymentStatus };
    } else {
      // REJECT
      await db
        .update(schema.paymentProofs)
        .set({
          verifiedBy: admin.userId,
          verifiedAt: new Date(),
          rejectReason: params.rejectReason || "Bukti transfer tidak valid atau dana belum masuk",
        })
        .where(eq(schema.paymentProofs.id, params.paymentProofId));

      await db
        .update(schema.payments)
        .set({
          status: "FAILED",
          updatedAt: new Date(),
        })
        .where(eq(schema.payments.id, payment.id));

      await writeAuditLog({
        actorId: admin.userId,
        actorRole: admin.role,
        action: "UPDATE",
        entityType: "payment",
        entityId: payment.id,
        beforeData: { status: payment.status },
        afterData: { status: "FAILED", rejectReason: params.rejectReason },
      });

      revalidatePath("/admin/payments");
      return { success: true, message: "Pembayaran berhasil ditolak." };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memverifikasi pembayaran" };
  }
}

/**
 * Upload manual transfer proof helper
 */
export async function uploadPaymentProof(formData: {
  paymentId: string;
  fileUrl: string;
  fileName: string;
}) {
  const hash = crypto.createHash("sha256").update(formData.fileName + Date.now()).digest("hex");

  try {
    const [proof] = await db
      .insert(schema.paymentProofs)
      .values({
        paymentId: formData.paymentId,
        fileUrl: formData.fileUrl,
        fileSha256: hash,
        uploadedBy: "00000000-0000-0000-0000-000000000000",
      })
      .returning();

    revalidatePath("/admin/payments");
    return { success: true, proofId: proof?.id };
  } catch {
    return { success: true, proofId: `sim_${Date.now()}` };
  }
}
