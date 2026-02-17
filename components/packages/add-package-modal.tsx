'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPackage } from '@/lib/actions/package.actions';
import { Service } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { Check, Clock, Euro } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddPackageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPackageAdded: () => void;
    services: Service[];
}

export function AddPackageModal({
    open,
    onOpenChange,
    onPackageAdded,
    services,
}: AddPackageModalProps) {
    const t = useTranslations('packages');
    const tCommon = useTranslations('common');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        selectedServices: [] as string[],
    });
    const [loading, setLoading] = useState(false);

    // Auto-calculate duration and sum price when services change
    useEffect(() => {
        const selected = services.filter((s) => formData.selectedServices.includes(s.id));
        const totalDuration = selected.reduce((acc, s) => acc + (s.duration || 0), 0);
        const totalPrice = selected.reduce((acc, s) => acc + s.price, 0);

        setFormData((prev) => ({
            ...prev,
            duration: totalDuration.toString(),
            // We only auto-set price if it's currently empty, or we could have a "suggested price"
            // Let's just auto-set it if it wasn't manually touched or keep it separate.
            // For now, let's just update duration automatically.
        }));
    }, [formData.selectedServices, services]);

    const toggleService = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(id)
                ? prev.selectedServices.filter((s) => s !== id)
                : [...prev.selectedServices, id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || formData.selectedServices.length === 0) {
            alert('Please fill in all required fields and select at least one service');
            return;
        }

        setLoading(true);
        try {
            await createPackage({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration),
                services: formData.selectedServices,
            });

            setFormData({
                name: '',
                description: '',
                price: '',
                duration: '',
                selectedServices: [],
            });
            onOpenChange(false);
            onPackageAdded();
        } catch (err) {
            console.error(err);
            alert('Failed to create package');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={t('addPackage')}
            description={t('subtitle')}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Input
                            label={tCommon('name') + " *"}
                            placeholder="e.g., Full Grooming Package"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Textarea
                            label={tCommon('description')}
                            placeholder="What's included in this package..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={tCommon('price') + " (€) *"}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <Input
                                label={t('totalDuration') + " (min) *"}
                                type="number"
                                min="0"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                                helperText="Auto-calculated from services"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-foreground-secondary">
                            {t('selectServices')} *
                        </label>
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                            {services.map((service) => {
                                const isSelected = formData.selectedServices.includes(service.id);
                                return (
                                    <div
                                        key={service.id}
                                        onClick={() => toggleService(service.id)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                                            isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-border hover:border-border-focus bg-card"
                                        )}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{service.name}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-foreground-muted flex items-center gap-1">
                                                    <Euro className="w-3 h-3" />
                                                    {service.price}
                                                </span>
                                                <span className="text-xs text-foreground-muted flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {service.duration} {tCommon('minutes')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                            isSelected ? "bg-primary border-primary" : "border-border-focus"
                                        )}>
                                            {isSelected && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 py-6 text-base"
                        disabled={loading}
                    >
                        {tCommon('cancel')}
                    </Button>
                    <Button type="submit" className="flex-1 py-6 text-base" disabled={loading}>
                        {loading ? tCommon('saving') : t('addPackage')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
