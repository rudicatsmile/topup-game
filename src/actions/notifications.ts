// src/actions/notifications.ts
"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function getUserNotifications() {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const list = await db
      .select()
      .from(schema.inAppNotifications)
      .where(eq(schema.inAppNotifications.userId, user.userId))
      .orderBy(desc(schema.inAppNotifications.createdAt))
      .limit(30);

    return list;
  } catch {
    return [];
  }
}

export async function markNotificationAsRead(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false };

  try {
    await db
      .update(schema.inAppNotifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(schema.inAppNotifications.id, id),
          eq(schema.inAppNotifications.userId, user.userId)
        )
      );
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser();
  if (!user) return { success: false };

  try {
    await db
      .update(schema.inAppNotifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(schema.inAppNotifications.userId, user.userId),
          isNull(schema.inAppNotifications.readAt)
        )
      );
    return { success: true };
  } catch {
    return { success: false };
  }
}
