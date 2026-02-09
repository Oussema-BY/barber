'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createShopWithOwner } from '@/lib/actions/admin.actions';

export default function CreateShopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createShopWithOwner(form);
      router.push('/admin/shops');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-2xl">
      {/* Back Link */}
      <Link
        href="/admin/shops"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shops
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Shop</h1>
        <p className="text-slate-500 mt-1">
          Set up a new shop and its owner account.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Shop Name */}
          <div>
            <label
              htmlFor="shopName"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Shop Name
            </label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              required
              value={form.shopName}
              onChange={handleChange}
              placeholder="e.g. Classic Cuts Barbershop"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label
              htmlFor="ownerName"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Owner Name
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              required
              value={form.ownerName}
              onChange={handleChange}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Owner Email */}
          <div>
            <label
              htmlFor="ownerEmail"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Owner Email
            </label>
            <input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              required
              value={form.ownerEmail}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>

          {/* Owner Password */}
          <div>
            <label
              htmlFor="ownerPassword"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Owner Password
            </label>
            <input
              id="ownerPassword"
              name="ownerPassword"
              type="password"
              required
              minLength={6}
              value={form.ownerPassword}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating...' : 'Create Shop'}
          </button>
          <Link
            href="/admin/shops"
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
