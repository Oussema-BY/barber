import Link from 'next/link';
import { Plus, Eye } from 'lucide-react';
import { getAllShops } from '@/lib/actions/admin.actions';

export default async function AdminShopsPage() {
  const shops = await getAllShops();

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Shops</h1>
          <p className="text-slate-500 mt-1">
            Manage all registered shops on the platform.
          </p>
        </div>
        <Link
          href="/admin/shops/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Shop
        </Link>
      </div>

      {/* Shops Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Invite Code
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shops.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No shops found. Create one to get started.
                  </td>
                </tr>
              ) : (
                shops.map(
                  (shop: {
                    id: string;
                    name: string;
                    ownerUserId: string;
                    status: string;
                    staffCount: number;
                    inviteCode: string;
                    createdAt: string;
                  }) => (
                    <tr key={shop.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {shop.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {shop.ownerUserId || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shop.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {shop.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {shop.staffCount.toLocaleString('en-US')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                        {shop.inviteCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(shop.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/shops/${shop.id}`}
                          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
