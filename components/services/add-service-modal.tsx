'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createService } from '@/lib/actions/service.actions';

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceAdded: () => void;
}

export function AddServiceModal({
  open,
  onOpenChange,
  onServiceAdded,
}: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createService({
        name: formData.name,
        price: parseFloat(formData.price),
      });

      setFormData({
        name: '',
        price: '',
      });
      onOpenChange(false);
      onServiceAdded();
    } catch {
      alert('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Service"
      description="Create a new barber service"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Name */}
        <Input
          label="Service Name *"
          placeholder="e.g., Classic Haircut"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        {/* Price */}
        <Input
          label="Price (€) *"
          type="number"
          min="0"
          step="0.01"
          placeholder="25.00"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Adding...' : 'Add Service'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
