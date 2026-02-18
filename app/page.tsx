"use client";

import { useState, useEffect } from "react";
import inventoryData from "@/data/inventory.json";

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

export default function Dashboard() {
  const [restockSuggestions, setRestockSuggestions] = useState<
    RestockSuggestion[]
  >([]);
  const [priceOptimizations, setPriceOptimizations] = useState<
    PriceOptimization[]
  >([]);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>(
    [],
  );
  const [loading, setLoading] = useState({
    restock: false,
    price: false,
    trending: false,
  });
  const [error, setError] = useState({
    restock: "",
    price: "",
    trending: "",
  });

  const fetchRestockSuggestions = async () => {
    setLoading((prev) => ({ ...prev, restock: true }));
    setError((prev) => ({ ...prev, restock: "" }));
    setRestockSuggestions([]);

    try {
      const response = await fetch("/api/ai/restock", { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to fetch restock suggestions");
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
                const parsed = JSON.parse(data);

                if (parsed.type === "status") {
                  // Status update - could show a loading indicator
                  console.log("Status:", parsed.message);
                } else if (parsed.type === "complete") {
                  setRestockSuggestions(parsed.data);
                } else if (parsed.type === "error") {
                  setError((prev) => ({ ...prev, restock: parsed.error }));
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        restock: "Failed to fetch restock suggestions",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, restock: false }));
    }
  };

  const fetchPriceOptimizations = async () => {
    setLoading((prev) => ({ ...prev, price: true }));
    setError((prev) => ({ ...prev, price: "" }));
    setPriceOptimizations([]);

    try {
      const response = await fetch("/api/ai/price", { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to fetch price optimizations");
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
                const parsed = JSON.parse(data);

                if (parsed.type === "status") {
                  console.log("Status:", parsed.message);
                } else if (parsed.type === "complete") {
                  setPriceOptimizations(parsed.data);
                } else if (parsed.type === "error") {
                  setError((prev) => ({ ...prev, price: parsed.error }));
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        price: "Failed to fetch price optimizations",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, price: false }));
    }
  };

  const fetchTrendingProducts = async () => {
    setLoading((prev) => ({ ...prev, trending: true }));
    setError((prev) => ({ ...prev, trending: "" }));
    setTrendingProducts([]);

    try {
      const response = await fetch("/api/ai/trending", { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to fetch trending products");
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
                const parsed = JSON.parse(data);

                if (parsed.type === "status") {
                  console.log("Status:", parsed.message);
                } else if (parsed.type === "complete") {
                  setTrendingProducts(parsed.data);
                } else if (parsed.type === "error") {
                  setError((prev) => ({ ...prev, trending: parsed.error }));
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        trending: "Failed to fetch trending products",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, trending: false }));
    }
  };

  // Fetch all suggestions on mount
  useEffect(() => {
    fetchRestockSuggestions();
    fetchPriceOptimizations();
    fetchTrendingProducts();
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">
            AI Inventory Intelligence
          </h1>
          <p className="text-zinc-600 mt-2">
            AI-powered insights for smarter inventory management
          </p>
        </div>

        {/* AI Suggestions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Restock Suggestions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900">
                Restock Suggestions
              </h2>
              <button
                onClick={fetchRestockSuggestions}
                disabled={loading.restock}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.restock ? "Loading..." : "Refresh"}
              </button>
            </div>
            {error.restock && (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                {error.restock}
              </div>
            )}
            {loading.restock ? (
              <div className="text-center py-8 text-zinc-500">
                Loading suggestions...
              </div>
            ) : restockSuggestions.length > 0 ? (
              <div className="space-y-3">
                {restockSuggestions.map((item) => (
                  <div
                    key={item.product_id}
                    className="border border-zinc-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-zinc-900">{item.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(
                          item.urgency,
                        )}`}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">{item.reason}</p>
                    <div className="text-sm">
                      <span className="text-zinc-500">Suggested qty: </span>
                      <span className="font-medium text-zinc-900">
                        {item.suggested_quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                No restock suggestions available
              </div>
            )}
          </div>

          {/* Price Optimizations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900">
                Price Optimization
              </h2>
              <button
                onClick={fetchPriceOptimizations}
                disabled={loading.price}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.price ? "Loading..." : "Refresh"}
              </button>
            </div>
            {error.price && (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                {error.price}
              </div>
            )}
            {loading.price ? (
              <div className="text-center py-8 text-zinc-500">
                Loading suggestions...
              </div>
            ) : priceOptimizations.length > 0 ? (
              <div className="space-y-3">
                {priceOptimizations.map((item) => (
                  <div
                    key={item.product_id}
                    className="border border-zinc-200 rounded-lg p-3"
                  >
                    <h3 className="font-medium text-zinc-900 mb-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm text-zinc-500">
                          Current: ${item.current_price.toFixed(2)}
                        </span>
                        <span className="text-zinc-400 mx-2">→</span>
                        <span className="text-sm font-medium text-zinc-900">
                          ${item.suggested_price.toFixed(2)}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          item.change_percentage > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.change_percentage > 0 ? "+" : ""}
                        {item.change_percentage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600">{item.reasoning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                No price optimizations available
              </div>
            )}
          </div>

          {/* Trending Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-zinc-900">
                Trending Products
              </h2>
              <button
                onClick={fetchTrendingProducts}
                disabled={loading.trending}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.trending ? "Loading..." : "Refresh"}
              </button>
            </div>
            {error.trending && (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                {error.trending}
              </div>
            )}
            {loading.trending ? (
              <div className="text-center py-8 text-zinc-500">
                Loading suggestions...
              </div>
            ) : trendingProducts.length > 0 ? (
              <div className="space-y-3">
                {trendingProducts.map((item) => (
                  <div
                    key={item.product_id}
                    className="border border-zinc-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-zinc-900">{item.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPotentialColor(
                          item.growth_potential,
                        )}`}
                      >
                        {item.growth_potential}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">
                      {item.trend_analysis}
                    </p>
                    <div className="text-sm">
                      <span className="text-zinc-500">
                        Projected increase:{" "}
                      </span>
                      <span className="font-medium text-green-600">
                        +{item.projected_sales_increase}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                No trending products available
              </div>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">
            Current Inventory
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600">
                    Product ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600">
                    Monthly Sales
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b border-zinc-100"
                  >
                    <td className="py-3 px-4 text-sm text-zinc-900">
                      {product.product_id}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-900">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-600">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.current_stock < 30
                            ? "bg-red-100 text-red-800"
                            : product.current_stock < 50
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.current_stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-900">
                      {product.monthly_sales}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
