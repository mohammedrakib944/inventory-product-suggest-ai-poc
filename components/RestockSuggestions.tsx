interface RestockSuggestion {
  product_id: string;
  name: string;
  urgency: "high" | "medium" | "low";
  reason: string;
  suggested_quantity: number;
}

interface RestockSuggestionsProps {
  suggestions: RestockSuggestion[];
}

function getUrgencyColor(urgency: string) {
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
}

export function RestockSuggestions({ suggestions }: RestockSuggestionsProps) {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        No restock suggestions available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((item) => (
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
  );
}
