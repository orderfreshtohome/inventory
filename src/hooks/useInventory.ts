import { useState, useEffect, useCallback } from 'react';
import { Product, Category, InventoryStats } from '@/types/inventory';

const PRODUCTS_KEY = 'inventory_products';
const CATEGORIES_KEY = 'inventory_categories';

const defaultCategories: Category[] = [
  { id: '1', name: 'Electronics', color: 'hsl(180, 70%, 45%)' },
  { id: '2', name: 'Furniture', color: 'hsl(45, 70%, 50%)' },
  { id: '3', name: 'Clothing', color: 'hsl(280, 60%, 55%)' },
  { id: '4', name: 'Food & Beverages', color: 'hsl(120, 50%, 45%)' },
];

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    
    setProducts(storedProducts ? JSON.parse(storedProducts) : []);
    setCategories(storedCategories ? JSON.parse(storedCategories) : defaultCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories, loading]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const getStats = useCallback((): InventoryStats => {
    return {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      lowStockItems: products.filter(p => p.quantity <= p.minStock).length,
      categories: categories.length,
    };
  }, [products, categories]);

  return {
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
  };
}
