import { NextRequest } from "next/server";
import { getTrendingProducts } from "@/lib/ai-service";
import inventoryData from "@/data/inventory.json";
import salesHistoryData from "@/data/sales-history.json";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial status
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "status", message: "Analyzing sales trends..." })}\n\n`,
          ),
        );

        // Get suggestions
        const suggestions = await getTrendingProducts(
          inventoryData,
          salesHistoryData,
        );

        // Send completion with data
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "complete", data: suggestions })}\n\n`,
          ),
        );

        controller.close();
      } catch (error) {
        console.error("Error in trending products API:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to get trending product suggestions",
            })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
