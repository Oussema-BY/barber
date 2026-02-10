'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateProductQuantity } from '@/lib/actions/product.actions';
import { Product } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface RestockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onRestocked: () => void;
}

export function RestockModal({ open, onOpenChange, product, onRestocked }: RestockModalProps) {
  const t = useTranslations('inventory');
  const tCommon = useTranslations('common');

  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !quantity) return;

    const addQty = parseInt(quantity);
    if (addQty <= 0) return;

    setLoading(true);
    try {
      await updateProductQuantity(product.id, product.quantity + addQty);
      setQuantity('');
      onOpenChange(false);
      onRestocked();
    } catch {
      alert('Failed to restock');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={t('restockProduct')} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-lg bg-secondary">
          <p className="font-semibold text-foreground">{product.name}</p>
          <p className="text-sm text-foreground-secondary mt-1">
            {t('currentStock')}: <span className="font-bold">{product.quantity}</span>
          </p>
        </div>

        <Input
          label={`${t('quantityToAdd')} *`}
          type="number"
          min="1"
          placeholder="10"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        {quantity && parseInt(quantity) > 0 && (
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <p className="text-sm text-foreground">
              {t('newStock')}: <span className="font-bold text-success">{product.quantity + parseInt(quantity)}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
            {tCommon('cancel')}
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? tCommon('saving') : t('restock')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
