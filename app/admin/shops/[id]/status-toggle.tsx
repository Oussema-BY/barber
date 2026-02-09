'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { updateShopStatus } from '@/lib/actions/admin.actions';

interface ShopStatusToggleProps {
  shopId: string;
  currentStatus: string;
}

export function ShopStatusToggle({
  shopId,
  currentStatus,
}: ShopStatusToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isSuspended = currentStatus === 'suspended';
  const nextStatus = isSuspended ? 'active' : 'suspended';
  const label = isSuspended ? 'Activate Shop' : 'Suspend Shop';

  const handleToggle = async () => {
    const confirmed = window.confirm(
      isSuspended
        ? 'Are you sure you want to activate this shop?'
        : 'Are you sure you want to suspend this shop? Members will lose access.'
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await updateShopStatus(shopId, nextStatus);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
        isSuspended
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-red-600 text-white hover:bg-red-700'
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isSuspended ? (
        <ShieldCheck className="w-4 h-4" />
      ) : (
        <ShieldOff className="w-4 h-4" />
      )}
      {loading ? 'Updating...' : label}
    </button>
  );
}
