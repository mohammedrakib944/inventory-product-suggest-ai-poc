import { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  loading: boolean;
  error: string;
  onRefresh: () => void;
  children: ReactNode;
}

export function InsightCard({
  title,
  loading,
  error,
  onRefresh,
  children,
}: InsightCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-8 text-zinc-500">
          Loading suggestions...
        </div>
      ) : (
        children
      )}
    </div>
  );
}
