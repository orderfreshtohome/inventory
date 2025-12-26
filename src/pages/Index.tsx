import { useState } from 'react';
import { Sidebar } from '@/components/inventory/Sidebar';
import { Dashboard } from '@/components/inventory/Dashboard';
import { ProductList } from '@/components/inventory/ProductList';
import { CategoryList } from '@/components/inventory/CategoryList';
import { Settings } from '@/components/inventory/Settings';
import { useInventory } from '@/hooks/useInventory';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    getStats,
  } = useInventory();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-primary font-display text-xl">Loading...</div>
      </div>
    );
  }

  const stats = getStats();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} products={products} />;
      case 'products':
        return (
          <ProductList
            products={products}
            categories={categories}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        );
      case 'categories':
        return (
          <CategoryList
            categories={categories}
            products={products}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        );
      case 'low-stock':
        return (
          <ProductList
            products={products}
            categories={categories}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            showLowStockOnly
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard stats={stats} products={products} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        lowStockCount={stats.lowStockItems}
      />
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
