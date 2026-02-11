'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, RotateCcw, Scissors, Loader2, Clock, Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { CATEGORY_COLORS } from '@/lib/constants';
import { Service, POSTransaction } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getServices } from '@/lib/actions/service.actions';
import { createTransaction, getTodayTransactions } from '@/lib/actions/transaction.actions';
import { useUser } from '@/lib/user-context';

export default function POSPage() {
  const t = useTranslations('pos');
  const tServices = useTranslations('services');
  const { name: userName } = useUser();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [cashReceived, setCashReceived] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Sales history
  const [todaySales, setTodaySales] = useState<POSTransaction[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [servicesData, salesData] = await Promise.all([
        getServices(),
        getTodayTransactions(),
      ]);
      setServices(servicesData);
      setTodaySales(salesData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate total (no tax for simplicity)
  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);

  // Calculate change
  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount > 0 ? cashAmount - total : 0;

  // Today's total revenue
  const todayRevenue = todaySales.reduce((sum, tx) => sum + tx.total, 0);

  const toggleService = (service: Service) => {
    const exists = selectedServices.find((s) => s.id === service.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) return;

    const now = new Date();
    try {
      await createTransaction({
        items: selectedServices.map((s) => ({
          name: s.name,
          price: s.price,
          quantity: 1,
          type: 'service',
          serviceId: s.id,
        })),
        subtotal: total,
        tax: 0,
        total,
        amountPaid: cashAmount > 0 ? cashAmount : total,
        change: change > 0 ? change : 0,
        paymentMethod: 'cash',
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        completedBy: userName,
      });
      // Reload sales history
      const salesData = await getTodayTransactions();
      setTodaySales(salesData);
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }

    setIsComplete(true);
  };

  const handleNewSale = () => {
    setSelectedServices([]);
    setCashReceived('');
    setIsComplete(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Success screen after completing sale
  if (isComplete) {
    return (
      <div className="p-4 md:p-6 lg:p-8 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('saleComplete')}</h1>
          <p className="text-foreground-secondary">{t('total')}: {formatCurrency(total)}</p>
          {change > 0 && (
            <p className="text-lg font-semibold text-emerald-600">
              {t('change')}: {formatCurrency(change)}
            </p>
          )}
          <Button onClick={handleNewSale} size="lg" className="mt-6">
            <RotateCcw className="w-5 h-5" />
            {t('newSale')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8 pb-48">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-foreground-secondary mt-1">{t('subtitle')}</p>
        </div>
        <Button variant="outline" onClick={() => setHistoryOpen(true)} className="shrink-0">
          <Receipt className="w-5 h-5" />
          <span className="hidden sm:inline">{t('todaySales')}</span>
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <Scissors className="w-8 h-8 text-foreground-muted" />
          </div>
          <p className="text-foreground-secondary font-medium">No services yet</p>
          <p className="text-foreground-muted text-sm mt-1">
            Add services from the Services page first
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {services.map((service) => {
          const isSelected = selectedServices.some((s) => s.id === service.id);
          const categoryColor = CATEGORY_COLORS[service.category ?? 'other'] || CATEGORY_COLORS.other;

          return (
            <button
              key={service.id}
              onClick={() => toggleService(service)}
              className={`p-4 rounded-xl border-2 transition-all text-start active:scale-[0.98] ${
                isSelected
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">
                    {service.name}
                  </p>
                  <p className={`text-xs mt-1 capitalize ${categoryColor.text}`}>
                    {tServices(service.category ?? 'other')}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="font-bold text-primary text-lg mt-3">
                {formatCurrency(service.price)}
              </p>
            </button>
          );
        })}
      </div>
      )}

      {/* Sales History Modal */}
      <Modal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        title={t('todaySales')}
        description={`${todaySales.length} ${t('transactions')} — ${formatCurrency(todayRevenue)}`}
        size="md"
      >
        {todaySales.length === 0 ? (
          <div className="py-8 text-center">
            <Receipt className="w-10 h-10 text-foreground-muted mx-auto mb-3" />
            <p className="text-sm text-foreground-secondary">{t('noSalesYet')}</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-96 overflow-y-auto -mx-6 px-6">
            {todaySales.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center gap-3">
                <div className="flex items-center gap-2 text-foreground-secondary shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{tx.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {tx.items.map((item) => item.name).join(', ')}
                  </p>
                  {tx.completedBy && (
                    <p className="text-xs text-foreground-tertiary">{tx.completedBy}</p>
                  )}
                </div>
                <span className="font-bold text-foreground shrink-0">
                  {formatCurrency(tx.total)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Fixed Bottom Panel */}
      <div className="fixed bottom-0 left-0 right-0 md:ltr:left-64 md:rtl:right-64 md:rtl:left-0 bg-card border-t border-border p-4 pb-24 md:pb-4 z-40">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Selected Services Summary */}
          {selectedServices.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((service) => (
                <span
                  key={service.id}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                >
                  {service.name}
                </span>
              ))}
            </div>
          )}

          {/* Total and Cash Input Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Total Display */}
            <div className="flex-1">
              <p className="text-sm text-foreground-secondary">{t('total')}</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(total)}</p>
            </div>

            {/* Cash Received Input (Optional) */}
            <div className="flex-1">
              <label className="text-sm text-foreground-secondary block mb-1">
                {t('cashReceived')}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="w-full px-4 py-2 text-lg font-semibold rounded-lg border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
              />
            </div>

            {/* Change Display */}
            {cashAmount > 0 && (
              <div className="flex-1">
                <p className="text-sm text-foreground-secondary">{t('change')}</p>
                <p className={`text-2xl font-bold ${change >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                  {formatCurrency(Math.abs(change))}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={selectedServices.length === 0}
            size="lg"
            className="w-full text-lg font-semibold py-6"
          >
            {selectedServices.length === 0 ? (
              <>
                <Scissors className="w-5 h-5" />
                {t('selectServices')}
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                {t('completeSale')} - {formatCurrency(total)}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
