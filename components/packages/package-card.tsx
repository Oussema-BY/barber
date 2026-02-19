import React from 'react';
import { Package as PackageIcon, Trash2, CalendarDays, Layers, Banknote, Pencil } from 'lucide-react';
import { Package } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PackageCardProps {
    packageData: Package;
    onEdit?: (pkg: Package) => void;
    onDelete?: (id: string) => void;
}

export function PackageCard({ packageData, onEdit, onDelete }: PackageCardProps) {
    const t = useTranslations('packages');

    return (
        <div className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200">
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary/50" />

            <div className="p-5">
                {/* Icon + Name */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <PackageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground truncate">
                            {packageData.name}
                        </h3>
                        {packageData.description && (
                            <p className="text-sm text-foreground-secondary line-clamp-2 mt-1">
                                {packageData.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Info badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/50 text-foreground-secondary text-xs font-medium">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{packageData.services.length} {packageData.services.length === 1 ? t('service') : t('servicesCount')}</span>
                    </div>
                </div>

                {/* Price & Actions */}
                <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-black text-foreground">
                        {formatCurrency(packageData.price)}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(packageData)}
                                className="p-2.5 hover:bg-primary/10 rounded-xl transition-all active:scale-95"
                            >
                                <Pencil className="w-4 h-4 text-primary" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(packageData.id)}
                                className="p-2.5 hover:bg-destructive/10 rounded-xl transition-all active:scale-95"
                            >
                                <Trash2 className="w-5 h-5 text-destructive" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
