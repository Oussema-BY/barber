'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createProduct } from '@/lib/actions/product.actions';
import { useTranslations } from 'next-intl';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductAdded: () => void;
}

export function AddProductModal({ open, onOpenChange, onProductAdded }: AddProductModalProps) {
  const t = useTranslations('inventory');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    costPrice: '',
    salePrice: '',
    quantity: '',
    minQuantity: '5',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.costPrice || !formData.salePrice) return;

    setLoading(true);
    try {
      await createProduct({
        name: formData.name,
        category: 'general',
        supplier: formData.supplier || '-',
        costPrice: parseFloat(formData.costPrice),
        salePrice: parseFloat(formData.salePrice),
        quantity: parseInt(formData.quantity) || 0,
        minQuantity: parseInt(formData.minQuantity) || 5,
      });
      setFormData({ name: '', supplier: '', costPrice: '', salePrice: '', quantity: '', minQuantity: '5' });
      onOpenChange(false);
      onProductAdded();
    } catch {
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) => setFormData({ ...formData, [key]: value });

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={t('addProduct')} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={`${t('productName')} *`}
          placeholder={t('productNamePlaceholder')}
          value={formData.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />

        <Input
          label={t('supplier')}
          placeholder={t('supplierPlaceholder')}
          value={formData.supplier}
          onChange={(e) => set('supplier', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={`${t('costPrice')} *`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData.costPrice}
            onChange={(e) => set('costPrice', e.target.value)}
            required
          />
          <Input
            label={`${t('salePrice')} *`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={formData.salePrice}
            onChange={(e) => set('salePrice', e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('initialQuantity')}
            type="number"
            min="0"
            placeholder="0"
            value={formData.quantity}
            onChange={(e) => set('quantity', e.target.value)}
          />
          <Input
            label={t('minQuantity')}
            type="number"
            min="0"
            placeholder="5"
            value={formData.minQuantity}
            onChange={(e) => set('minQuantity', e.target.value)}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
            {tCommon('cancel')}
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? tCommon('saving') : t('addProduct')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
