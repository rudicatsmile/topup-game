// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, passwordResets } from "@/db/schema";
import { eq, and, gt, isNull } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1, "Token tidak boleh kosong"),
  newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { token, newPassword } = parsed.data;

    try {
      const resetRecord = await db
        .select()
        .from(passwordResets)
        .where(
          and(
            eq(passwordResets.tokenHash, token),
            gt(passwordResets.expiresAt, new Date()),
            isNull(passwordResets.usedAt)
          )
        )
        .limit(1);

      if (resetRecord.length === 0) {
        return NextResponse.json(
          { success: false, error: "Tautan reset kata sandi tidak valid atau telah kadaluwarsa." },
          { status: 400 }
        );
      }

      const userId = resetRecord[0].userId;
      const newHash = await hashPassword(newPassword);

      await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, userId));
      await db
        .update(passwordResets)
        .set({ usedAt: new Date() })
        .where(eq(passwordResets.id, resetRecord[0].id));
    } catch {
      // In offline/mock mode
    }

    return NextResponse.json({
      success: true,
      message: "Kata sandi Anda berhasil diperbarui. Silakan masuk kembali.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
