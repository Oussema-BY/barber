'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Minus, Plus, AlertCircle, Package, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getProducts, updateProductQuantity } from '@/lib/actions/product.actions';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const lowStockProducts = products.filter((p) => p.quantity <= p.minQuantity);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.quantity * p.costPrice, 0);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setProducts(products.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p)));
    try {
      await updateProductQuantity(id, newQuantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      loadProducts();
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Inventory</h1>
        <p className="text-foreground-secondary mt-1">Manage your stock and products</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-sm font-medium text-foreground-secondary">Total Products</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-sm font-medium text-foreground-secondary">Inventory Value</p>
            <p className="text-xl md:text-2xl font-bold text-foreground mt-2">
              {formatCurrency(totalInventoryValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-sm font-medium text-foreground-secondary">Low Stock Items</p>
            <p className="text-2xl md:text-3xl font-bold text-warning mt-2">{lowStockProducts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-warning-light bg-warning-light">
          <CardContent className="pt-5 pb-5 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-warning mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-warning-foreground">Low Stock Alert</h3>
              <p className="text-sm text-warning-foreground/80 mt-1">
                {lowStockProducts.length} product(s) are below minimum quantity:
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {lowStockProducts.map((p) => (
                  <Badge key={p.id} variant="warning" size="sm">
                    {p.name} ({p.quantity}/{p.minQuantity})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products - Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {products.map((product) => {
          const isLowStock = product.quantity <= product.minQuantity;
          return (
            <Card key={product.id} className={isLowStock ? 'border-warning/50' : ''}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-xs text-foreground-tertiary">{product.supplier}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-foreground-secondary">{product.category}</span>
                      <span className="font-bold text-foreground">{formatCurrency(product.salePrice)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-foreground-secondary"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={`w-8 text-center font-bold ${isLowStock ? 'text-warning' : 'text-foreground'}`}>
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-foreground-secondary"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-20 bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isLowStock
                            ? 'bg-warning'
                            : product.quantity > product.minQuantity * 2
                            ? 'bg-success'
                            : 'bg-info'
                        }`}
                        style={{
                          width: `${Math.min((product.quantity / (product.minQuantity * 3)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Products Table - Desktop */}
      <Card className="hidden md:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold text-foreground-secondary">Product</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground-secondary">Category</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground-secondary">Cost</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground-secondary">Sale Price</th>
                  <th className="text-center py-3 px-3 font-semibold text-foreground-secondary">Quantity</th>
                  <th className="text-center py-3 px-3 font-semibold text-foreground-secondary">Min</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground-secondary">Stock Level</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isLowStock = product.quantity <= product.minQuantity;
                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-border hover:bg-card-hover transition-colors ${
                        isLowStock ? 'bg-warning-light/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-foreground-tertiary">{product.supplier}</p>
                      </td>
                      <td className="py-3 px-3 text-foreground-secondary">{product.category}</td>
                      <td className="py-3 px-3 text-right text-foreground-secondary">
                        {formatCurrency(product.costPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-foreground">
                        {formatCurrency(product.salePrice)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-foreground-secondary"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`w-8 text-center font-bold ${isLowStock ? 'text-warning' : 'text-foreground'}`}>
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-foreground-secondary"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-sm font-semibold ${isLowStock ? 'text-warning' : 'text-foreground-secondary'}`}>
                          {product.minQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isLowStock
                                ? 'bg-warning'
                                : product.quantity > product.minQuantity * 2
                                ? 'bg-success'
                                : 'bg-info'
                            }`}
                            style={{
                              width: `${Math.min((product.quantity / (product.minQuantity * 3)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
