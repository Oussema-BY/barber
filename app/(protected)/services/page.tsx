'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Scissors, Search, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/services/service-card';
import { AddServiceModal } from '@/components/services/add-service-modal';
import { Service } from '@/lib/types';
import { getServices, deleteService } from '@/lib/actions/service.actions';
import { useUser } from '@/lib/user-context';

export default function ServicesPage() {
  const t = useTranslations('services');
  const { shopRole } = useUser();
  const isOwner = shopRole === 'owner';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadServices = useCallback(async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filteredServices = useMemo(() => {
    if (!searchTerm) return services;
    const term = searchTerm.toLowerCase();
    return services.filter((s) =>
      s.name.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term)
    );
  }, [services, searchTerm]);

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id);
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete service:', err);
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-foreground-secondary mt-1">{t('subtitle')}</p>
        </div>
        {isOwner && (
          <Button
            onClick={() => setAddServiceModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>{t('addService')}</span>
          </Button>
        )}
      </div>

      {/* Search */}
      {services.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            placeholder={t('searchServices')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      )}

      {/* Stats */}
      {services.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-foreground-secondary">
          <span className="bg-secondary px-3 py-1 rounded-full font-medium">
            {services.length} {services.length === 1 ? t('service') : t('servicesCount')}
          </span>
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Scissors className="w-8 h-8 text-foreground-muted" />
          </div>
          <p className="text-foreground-secondary font-medium">
            {searchTerm ? t('noServicesFound') : t('noServices')}
          </p>
          <p className="text-foreground-muted text-sm mt-1">
            {searchTerm ? t('tryAdjusting') : t('createFirst')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDelete={isOwner ? handleDeleteService : undefined}
            />
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {isOwner && (
        <AddServiceModal
          open={addServiceModalOpen}
          onOpenChange={setAddServiceModalOpen}
          onServiceAdded={loadServices}
        />
      )}
    </div>
  );
}
