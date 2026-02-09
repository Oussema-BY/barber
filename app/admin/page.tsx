import { Store, Users, Activity } from 'lucide-react';
import { getAdminStats } from '@/lib/actions/admin.actions';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of all shops and platform activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Shops</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalShops.toLocaleString('en-US')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Shops</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.activeShops.toLocaleString('en-US')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Members
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalMembers.toLocaleString('en-US')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shops */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Shops
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Invite Code
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentShops.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No shops created yet.
                  </td>
                </tr>
              ) : (
                stats.recentShops.map(
                  (shop: {
                    _id: string;
                    name: string;
                    status: string;
                    inviteCode: string;
                    createdAt: string;
                  }) => (
                    <tr key={shop._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {shop.name}
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
