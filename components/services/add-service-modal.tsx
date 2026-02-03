'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ServiceCategory } from '@/lib/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';
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
    category: 'hair' as ServiceCategory,
    price: '',
    duration: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.duration) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createService({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration, 10),
        description: formData.description || undefined,
      });

      setFormData({
        name: '',
        category: 'hair',
        price: '',
        duration: '',
        description: '',
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

        {/* Category */}
        <Select
          label="Category *"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value as ServiceCategory })
          }
          options={SERVICE_CATEGORIES.map((cat) => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1)
          }))}
          required
        />

        {/* Price & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <Input
            label="Duration (min) *"
            type="number"
            min="5"
            step="5"
            placeholder="30"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Describe the service..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
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
