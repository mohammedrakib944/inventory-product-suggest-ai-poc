interface TrendingProduct {
  product_id: string;
  name: string;
  category: string;
  growth_potential: "high" | "medium" | "low";
  trend_analysis: string;
  projected_sales_increase: number;
}

interface TrendingProductsProps {
  products: TrendingProduct[];
}

function getPotentialColor(potential: string) {
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
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No trending products available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((item) => (
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
          <p className="text-sm text-zinc-600 mb-2">{item.trend_analysis}</p>
          <div className="text-sm">
            <span className="text-zinc-500">Projected increase: </span>
            <span className="font-medium text-green-600">
              +{item.projected_sales_increase}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
