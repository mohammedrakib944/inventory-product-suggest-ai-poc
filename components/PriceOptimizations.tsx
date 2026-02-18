interface PriceOptimization {
  product_id: string;
  name: string;
  current_price: number;
  suggested_price: number;
  change_percentage: number;
  reasoning: string;
}

interface PriceOptimizationsProps {
  optimizations: PriceOptimization[];
}

export function PriceOptimizations({ optimizations }: PriceOptimizationsProps) {
  if (optimizations.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No price optimizations available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {optimizations.map((item) => (
        <div
          key={item.product_id}
          className="border border-zinc-200 rounded-lg p-3"
        >
          <h3 className="font-medium text-zinc-900 mb-2">{item.name}</h3>
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
                item.change_percentage > 0 ? "text-green-600" : "text-red-600"
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
  );
}
