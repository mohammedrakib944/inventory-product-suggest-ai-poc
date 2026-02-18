import { useState, useCallback } from "react";

interface RestockSuggestion {
  product_id: string;
  name: string;
  urgency: "high" | "medium" | "low";
  reason: string;
  suggested_quantity: number;
}

interface PriceOptimization {
  product_id: string;
  name: string;
  current_price: number;
  suggested_price: number;
  change_percentage: number;
  reasoning: string;
}

interface TrendingProduct {
  product_id: string;
  name: string;
  category: string;
  growth_potential: "high" | "medium" | "low";
  trend_analysis: string;
  projected_sales_increase: number;
}

interface StreamResponse {
  type: "status" | "complete" | "error";
  message?: string;
  data?: unknown;
  error?: string;
}

async function streamAPI(
  endpoint: string,
  onChunk?: (data: StreamResponse) => void,
) {
  const response = await fetch(endpoint, { method: "POST" });

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${endpoint}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response reader available");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data.trim()) {
          try {
            const parsed = JSON.parse(data) as StreamResponse;
            if (onChunk) {
              onChunk(parsed);
            }
          } catch (e) {
            console.error("Error parsing SSE data:", e);
          }
        }
      }
    }
  }
}

export function useRestockSuggestions() {
  const [data, setData] = useState<RestockSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError("");
    setData([]);

    try {
      await streamAPI("/api/ai/restock", (parsed) => {
        if (parsed.type === "status") {
          console.log("Status:", parsed.message);
        } else if (parsed.type === "complete" && parsed.data) {
          setData(parsed.data as RestockSuggestion[]);
        } else if (parsed.type === "error") {
          setError(parsed.error || "Unknown error occurred");
        }
      });
    } catch (err) {
      setError("Failed to fetch restock suggestions");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetchSuggestions };
}

export function usePriceOptimizations() {
  const [data, setData] = useState<PriceOptimization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOptimizations = useCallback(async () => {
    setLoading(true);
    setError("");
    setData([]);

    try {
      await streamAPI("/api/ai/price", (parsed) => {
        if (parsed.type === "status") {
          console.log("Status:", parsed.message);
        } else if (parsed.type === "complete" && parsed.data) {
          setData(parsed.data as PriceOptimization[]);
        } else if (parsed.type === "error") {
          setError(parsed.error || "Unknown error occurred");
        }
      });
    } catch (err) {
      setError("Failed to fetch price optimizations");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetchOptimizations };
}

export function useTrendingProducts() {
  const [data, setData] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError("");
    setData([]);

    try {
      await streamAPI("/api/ai/trending", (parsed) => {
        if (parsed.type === "status") {
          console.log("Status:", parsed.message);
        } else if (parsed.type === "complete" && parsed.data) {
          setData(parsed.data as TrendingProduct[]);
        } else if (parsed.type === "error") {
          setError(parsed.error || "Unknown error occurred");
        }
      });
    } catch (err) {
      setError("Failed to fetch trending products");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetchTrending };
}
