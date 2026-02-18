"use client";

import { useEffect } from "react";
import inventoryData from "@/data/inventory.json";
import {
  useRestockSuggestions,
  usePriceOptimizations,
  useTrendingProducts,
} from "@/hooks/useAIInsights";
import { InsightCard } from "@/components/InsightCard";
import { RestockSuggestions } from "@/components/RestockSuggestions";
import { PriceOptimizations } from "@/components/PriceOptimizations";
import { TrendingProducts } from "@/components/TrendingProducts";
import { InventoryTable } from "@/components/InventoryTable";

export default function Dashboard() {
  const restock = useRestockSuggestions();
  const price = usePriceOptimizations();
  const trending = useTrendingProducts();

  // Fetch all suggestions on mount
  useEffect(() => {
    restock.refetch();
    price.refetch();
    trending.refetch();
  }, []);

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
          <InsightCard
            title="Restock Suggestions"
            loading={restock.loading}
            error={restock.error}
            onRefresh={restock.refetch}
          >
            <RestockSuggestions suggestions={restock.data} />
          </InsightCard>

          {/* Price Optimizations */}
          <InsightCard
            title="Price Optimization"
            loading={price.loading}
            error={price.error}
            onRefresh={price.refetch}
          >
            <PriceOptimizations optimizations={price.data} />
          </InsightCard>

          {/* Trending Products */}
          <InsightCard
            title="Trending Products"
            loading={trending.loading}
            error={trending.error}
            onRefresh={trending.refetch}
          >
            <TrendingProducts products={trending.data} />
          </InsightCard>
        </div>

        {/* Inventory Table */}
        <InventoryTable inventory={inventoryData} />
      </div>
    </div>
  );
}
