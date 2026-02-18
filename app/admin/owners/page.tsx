import Link from 'next/link';
import { Eye } from 'lucide-react';
import { getAllOwners } from '@/lib/actions/admin.actions';

export default async function AdminOwnersPage() {
  const owners = await getAllOwners();

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Owners</h1>
        <p className="text-slate-500 mt-1">
          Manage all shop owners on the platform.
        </p>
      </div>

      {/* Owners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Shop
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Shop Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {owners.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No owners found.
                  </td>
                </tr>
              ) : (
                owners.map(
                  (owner: {
                    id: string;
                    name: string;
                    email: string;
                    createdAt: string;
                    shopId: string;
                    shopName: string;
                    shopStatus: string;
                    isActive: boolean;
                  }) => (
                    <tr key={owner.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {owner.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {owner.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {owner.shopName || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            owner.shopStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {owner.shopStatus === 'active'
                            ? 'Active'
                            : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            owner.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {owner.isActive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {owner.createdAt
                          ? new Date(owner.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/shops/${owner.shopId}`}
                          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Shop
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
