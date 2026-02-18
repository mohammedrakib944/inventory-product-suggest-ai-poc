interface Product {
  product_id: string;
  name: string;
  category: string;
  current_stock: number;
  price: number;
  monthly_sales: number;
}

interface InventoryTableProps {
  inventory: Product[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const getStockBadgeColor = (stock: number) => {
    if (stock < 30) return "bg-red-100 text-red-800";
    if (stock < 50) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
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
            {inventory.map((product) => (
              <tr key={product.product_id} className="border-b border-zinc-100">
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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStockBadgeColor(
                      product.current_stock,
                    )}`}
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
  );
}
