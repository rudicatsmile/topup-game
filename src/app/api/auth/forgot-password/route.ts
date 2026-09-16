// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, passwordResets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    let user;
    try {
      const found = await db.select().from(users).where(eq(users.email, email)).limit(1);
      user = found[0];
    } catch {}

    // Even if user not found, respond with success to prevent user enumeration
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      try {
        await db.insert(passwordResets).values({
          userId: user.id,
          tokenHash: token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        });
      } catch {}
      console.log(`[AUTH] Reset token for ${email}: ${token}`);
    }

    return NextResponse.json({
      success: true,
      message: "Jika email terdaftar, tautan pengaturan ulang kata sandi telah dikirimkan ke email Anda.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
