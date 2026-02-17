'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Package as PackageIcon, Search, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { PackageCard } from '@/components/packages/package-card';
import { AddPackageModal } from '@/components/packages/add-package-modal';
import { Package, Service } from '@/lib/types';
import { getPackages, deletePackage } from '@/lib/actions/package.actions';
import { getServices } from '@/lib/actions/service.actions';
import { useUser } from '@/lib/user-context';

export default function PackagesPage() {
    const t = useTranslations('packages');
    const { shopRole } = useUser();
    const isOwner = shopRole === 'owner';
    const [packages, setPackages] = useState<Package[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [addPackageModalOpen, setAddPackageModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const loadData = useCallback(async () => {
        try {
            const [packagesData, servicesData] = await Promise.all([
                getPackages(),
                getServices()
            ]);
            setPackages(packagesData);
            setServices(servicesData);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredPackages = useMemo(() => {
        if (!searchTerm) return packages;
        const term = searchTerm.toLowerCase();
        return packages.filter((p) =>
            p.name.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term)
        );
    }, [packages, searchTerm]);

    const handleDeletePackage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        try {
            await deletePackage(id);
            setPackages(packages.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Failed to delete package:', err);
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
                        onClick={() => setAddPackageModalOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{t('addPackage')}</span>
                    </Button>
                )}
            </div>

            {/* Search */}
            {packages.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                    <input
                        type="text"
                        placeholder={t('searchPackages')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>
            )}

            {/* Stats */}
            {packages.length > 0 && (
                <div className="flex items-center gap-3 text-sm text-foreground-secondary">
                    <span className="bg-secondary px-3 py-1 rounded-full font-medium">
                        {packages.length} {packages.length === 1 ? t('package') : t('packagesCount')}
                    </span>
                </div>
            )}

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                        <PackageIcon className="w-8 h-8 text-foreground-muted" />
                    </div>
                    <p className="text-foreground-secondary font-medium">
                        {searchTerm ? t('noPackagesFound') : t('noPackages')}
                    </p>
                    <p className="text-foreground-muted text-sm mt-1">
                        {searchTerm ? t('tryAdjusting') : t('createFirst')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPackages.map((pkg) => (
                        <PackageCard
                            key={pkg.id}
                            packageData={pkg}
                            onDelete={isOwner ? handleDeletePackage : undefined}
                        />
                    ))}
                </div>
            )}

            {/* Add Package Modal */}
            {isOwner && (
                <AddPackageModal
                    open={addPackageModalOpen}
                    onOpenChange={setAddPackageModalOpen}
                    onPackageAdded={loadData}
                    services={services}
                />
            )}
        </div>
    );
}
