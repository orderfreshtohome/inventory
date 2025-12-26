import { LayoutDashboard, Package, Tags, AlertTriangle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  lowStockCount: number;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, lowStockCount }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar min-h-screen p-4 flex flex-col border-r border-sidebar-border">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-display font-bold text-sidebar-primary">
          Inventory<span className="text-sidebar-foreground">Pro</span>
        </h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Management System</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
            {item.id === 'low-stock' && lowStockCount > 0 && (
              <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                {lowStockCount}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">
          Data stored locally in browser
        </p>
      </div>
    </aside>
  );
}
