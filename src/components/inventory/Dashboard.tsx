import { Package, DollarSign, AlertTriangle, Tags } from 'lucide-react';
import { StatCard } from './StatCard';
import { InventoryStats, Product } from '@/types/inventory';

interface DashboardProps {
  stats: InventoryStats;
  products: Product[];
}

export function Dashboard({ stats, products }: DashboardProps) {
  const recentProducts = products
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lowStockProducts = products.filter(p => p.quantity <= p.minStock).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your inventory status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={Tags}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Recent Products</h3>
          {recentProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No products yet</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sku}</p>
                  </div>
                  <span className="text-sm font-medium text-foreground">{product.quantity} units</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Low Stock Alert</h3>
          {lowStockProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">All items are well stocked</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Min: {product.minStock} units</p>
                  </div>
                  <span className="text-sm font-bold text-warning">{product.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
