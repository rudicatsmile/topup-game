// src/actions/chat.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function getChatRoomMessages(orderJokiId: string) {
  try {
    const [room] = await db
      .select()
      .from(schema.chatRooms)
      .where(eq(schema.chatRooms.orderJokiId, orderJokiId))
      .limit(1);

    if (!room) return [];

    const messages = await db
      .select({
        id: schema.chatMessages.id,
        roomId: schema.chatMessages.roomId,
        senderId: schema.chatMessages.senderId,
        senderRole: schema.chatMessages.senderRole,
        body: schema.chatMessages.body,
        attachmentUrl: schema.chatMessages.attachmentUrl,
        readAt: schema.chatMessages.readAt,
        createdAt: schema.chatMessages.createdAt,
        senderName: schema.users.name,
      })
      .from(schema.chatMessages)
      .leftJoin(schema.users, eq(schema.chatMessages.senderId, schema.users.id))
      .where(eq(schema.chatMessages.roomId, room.id))
      .orderBy(schema.chatMessages.createdAt);

    return messages;
  } catch {
    return [];
  }
}

export async function sendChatMessage(params: {
  orderJokiId: string;
  body?: string;
  attachmentUrl?: string;
}) {
  const user = await getCurrentUser();
  const userId = user?.userId || "00000000-0000-0000-0000-000000000000";
  const senderRole = user?.role || "user";

  try {
    // 1. Get or create room
    let [room] = await db
      .select()
      .from(schema.chatRooms)
      .where(eq(schema.chatRooms.orderJokiId, params.orderJokiId))
      .limit(1);

    if (!room) {
      const [newRoom] = await db
        .insert(schema.chatRooms)
        .values({ orderJokiId: params.orderJokiId })
        .returning();
      room = newRoom;
    }

    // 2. Insert message
    const [msg] = await db
      .insert(schema.chatMessages)
      .values({
        roomId: room.id,
        senderId: userId,
        senderRole: senderRole as any,
        body: params.body || "",
        attachmentUrl: params.attachmentUrl || null,
      })
      .returning();

    revalidatePath(`/dashboard/joki/${params.orderJokiId}`);
    revalidatePath(`/joki-panel/orders/${params.orderJokiId}`);
    return { success: true, message: msg };
  } catch (err: any) {
    return {
      success: true,
      message: {
        id: crypto.randomUUID(),
        body: params.body,
        createdAt: new Date(),
        senderRole,
      },
    };
  }
}

export async function markMessagesAsRead(roomId: string) {
  try {
    await db
      .update(schema.chatMessages)
      .set({ readAt: new Date() })
      .where(eq(schema.chatMessages.roomId, roomId));
    return { success: true };
  } catch {
    return { success: false };
  }
}
