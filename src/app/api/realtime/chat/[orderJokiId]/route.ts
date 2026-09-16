// src/app/api/realtime/chat/[orderJokiId]/route.ts
import { NextRequest } from "next/server";
import { getChatRoomMessages } from "@/actions/chat";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderJokiId: string }> }
) {
  const { orderJokiId } = await params;

  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      try {
        const initial = await getChatRoomMessages(orderJokiId);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));
      } catch {}

      // Heartbeat & periodic sync every 3 seconds for realtime feel
      intervalId = setInterval(async () => {
        try {
          const fresh = await getChatRoomMessages(orderJokiId);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(fresh)}\n\n`));
        } catch {
          // Keep-alive comment
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        }
      }, 3000);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
