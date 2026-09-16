// src/app/api/realtime/notifications/route.ts
import { NextRequest } from "next/server";
import { getUserNotifications } from "@/actions/notifications";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let intervalId: NodeJS.Timeout;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const initial = await getUserNotifications();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));
      } catch {}

      intervalId = setInterval(async () => {
        try {
          const fresh = await getUserNotifications();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(fresh)}\n\n`));
        } catch {
          controller.enqueue(encoder.encode(`: keep-alive\n\n`));
        }
      }, 5000);
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
