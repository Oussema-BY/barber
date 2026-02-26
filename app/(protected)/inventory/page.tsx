'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { useTranslations } from 'next-intl';
import { Minus, Plus, AlertCircle, Package, Loader2, Trash2, Edit2, ShoppingCart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getProducts, updateProductQuantity, deleteProduct } from '@/lib/actions/product.actions';
import { AddProductModal } from '@/components/inventory/add-product-modal';
import { EditProductModal } from '@/components/inventory/edit-product-modal';
import { RestockModal } from '@/components/inventory/restock-modal';

export default function InventoryPage() {
  const router = useRouter();
  const { shopRole } = useUser();
  const t = useTranslations('inventory');

  useEffect(() => {
    if (shopRole && shopRole !== 'owner') {
      router.replace('/dashboard');
    }
  }, [shopRole, router]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    setProducts(products.filter((p) => p.id !== id));
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error('Failed to delete product:', err);
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-foreground-secondary mt-1">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} className="shrink-0">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">{t('addProduct')}</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-sm font-medium text-foreground-secondary">{t('totalProducts')}</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-sm font-medium text-foreground-secondary">{t('inventoryValue')}</p>
            <p className="text-xl md:text-2xl font-bold text-foreground mt-2">
              {formatCurrency(totalInventoryValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-5">
            <p className="text-sm font-medium text-foreground-secondary">{t('lowStockItems')}</p>
            <p className="text-2xl md:text-3xl font-bold text-warning mt-2">{lowStockProducts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-warning-light bg-warning-light">
          <CardContent className="pt-5 pb-5 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-warning mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-warning-foreground">{t('lowStockAlert')}</h3>
              <p className="text-sm text-warning-foreground/80 mt-1">
                {lowStockProducts.length} {t('productsBelowMin')}
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

      {/* Empty State */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-12 h-12 text-foreground-muted mb-4" />
            <h3 className="text-lg font-bold text-foreground">{t('noProducts')}</h3>
            <p className="text-sm text-foreground-secondary mt-1 mb-4">{t('noProductsDescription')}</p>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="w-5 h-5" />
              {t('addProduct')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
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
                        <p className="font-bold text-foreground mt-2">{formatCurrency(product.salePrice)}</p>
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
                    {/* Mobile action buttons */}
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border justify-end">
                      <button
                        onClick={() => setRestockProduct(product)}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors active:scale-95"
                        title={t('restock')}
                      >
                        <ShoppingCart className="w-4 h-4 text-success" />
                      </button>
                      <button
                        onClick={() => setEditProduct(product)}
                        className="p-1.5 hover:bg-secondary rounded-lg transition-colors active:scale-95"
                        title={t('editProduct')}
                      >
                        <Edit2 className="w-4 h-4 text-foreground-tertiary" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 hover:bg-destructive-light rounded-lg transition-colors active:scale-95"
                        title={t('deleteProduct')}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Products Table - Desktop */}
          <Card className="hidden md:block">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t('products')} ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 font-semibold text-foreground-secondary">{t('product')}</th>
                      <th className="text-right py-3 px-3 font-semibold text-foreground-secondary">{t('cost')}</th>
                      <th className="text-right py-3 px-3 font-semibold text-foreground-secondary">{t('salePrice')}</th>
                      <th className="text-center py-3 px-3 font-semibold text-foreground-secondary">{t('quantity')}</th>
                      <th className="text-center py-3 px-3 font-semibold text-foreground-secondary">{t('min')}</th>
                      <th className="text-left py-3 px-3 font-semibold text-foreground-secondary">{t('stockLevel')}</th>
                      <th className="text-center py-3 px-3 font-semibold text-foreground-secondary">{t('actions')}</th>
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
                          <td className="py-3 px-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setRestockProduct(product)}
                                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                                title={t('restock')}
                              >
                                <ShoppingCart className="w-4 h-4 text-success" />
                              </button>
                              <button
                                onClick={() => setEditProduct(product)}
                                className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                                title={t('editProduct')}
                              >
                                <Edit2 className="w-4 h-4 text-foreground-tertiary" />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-1.5 hover:bg-destructive-light rounded-lg transition-colors"
                                title={t('deleteProduct')}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
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
        </>
      )}

      {/* Modals */}
      <AddProductModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onProductAdded={loadProducts}
      />
      <EditProductModal
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        product={editProduct}
        onProductUpdated={loadProducts}
      />
      <RestockModal
        open={!!restockProduct}
        onOpenChange={(open) => !open && setRestockProduct(null)}
        product={restockProduct}
        onRestocked={loadProducts}
      />
    </div>
  );
}
