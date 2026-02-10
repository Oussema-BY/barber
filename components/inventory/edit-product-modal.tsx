'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProduct } from '@/lib/actions/product.actions';
import { Product } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onProductUpdated: () => void;
}

export function EditProductModal({ open, onOpenChange, product, onProductUpdated }: EditProductModalProps) {
  const t = useTranslations('inventory');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    costPrice: '',
    salePrice: '',
    minQuantity: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        supplier: product.supplier,
        costPrice: String(product.costPrice),
        salePrice: String(product.salePrice),
        minQuantity: String(product.minQuantity),
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !formData.name || !formData.costPrice || !formData.salePrice) return;

    setLoading(true);
    try {
      await updateProduct(product.id, {
        name: formData.name,
        supplier: formData.supplier || '-',
        costPrice: parseFloat(formData.costPrice),
        salePrice: parseFloat(formData.salePrice),
        minQuantity: parseInt(formData.minQuantity) || 5,
      });
      onOpenChange(false);
      onProductUpdated();
    } catch {
      alert('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const set = (key: string, value: string) => setFormData({ ...formData, [key]: value });

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={t('editProduct')} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={`${t('productName')} *`}
          value={formData.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />

        <Input
          label={t('supplier')}
          value={formData.supplier}
          onChange={(e) => set('supplier', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={`${t('costPrice')} *`}
            type="number"
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) => set('costPrice', e.target.value)}
            required
          />
          <Input
            label={`${t('salePrice')} *`}
            type="number"
            min="0"
            step="0.01"
            value={formData.salePrice}
            onChange={(e) => set('salePrice', e.target.value)}
            required
          />
        </div>

        <Input
          label={t('minQuantity')}
          type="number"
          min="0"
          value={formData.minQuantity}
          onChange={(e) => set('minQuantity', e.target.value)}
        />

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
            {tCommon('cancel')}
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? tCommon('saving') : tCommon('save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
