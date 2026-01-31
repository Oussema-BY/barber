'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Scissors, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/services/service-card';
import { AddServiceModal } from '@/components/services/add-service-modal';
import { MOCK_SERVICES, SERVICE_CATEGORIES } from '@/lib/constants';
import { Service, ServiceCategory } from '@/lib/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = useMemo(() => {
    let result = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((s) =>
        s.name.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [services, selectedCategory, searchTerm]);

  const handleAddService = (service: Service) => {
    setServices([...services, service]);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Services</h1>
          <p className="text-foreground-secondary mt-1">Manage your barber services and pricing</p>
        </div>
        <Button
          onClick={() => setAddServiceModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground-secondary border border-border hover:bg-secondary'
            }`}
          >
            All ({services.length})
          </button>
          {SERVICE_CATEGORIES.map((category) => {
            const count = services.filter((s) => s.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize active:scale-95 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground-secondary border border-border hover:bg-secondary'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Scissors className="w-8 h-8 text-foreground-muted" />
          </div>
          <p className="text-foreground-secondary font-medium">
            {searchTerm
              ? 'No services found'
              : selectedCategory === 'all'
                ? 'No services yet'
                : `No ${selectedCategory} services`}
          </p>
          <p className="text-foreground-muted text-sm mt-1">
            {searchTerm ? 'Try adjusting your search' : 'Create your first service to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      <AddServiceModal
        open={addServiceModalOpen}
        onOpenChange={setAddServiceModalOpen}
        onAdd={handleAddService}
      />
    </div>
  );
}
