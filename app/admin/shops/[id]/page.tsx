import Link from 'next/link';
import { ArrowLeft, Users } from 'lucide-react';
import { getShopDetails } from '@/lib/actions/admin.actions';
import { ShopStatusToggle } from './status-toggle';
import { CopyButton } from './copy-button';

interface ShopDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { id } = await params;
  const { shop, members } = await getShopDetails(id);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/admin/shops"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shops
      </Link>

      {/* Shop Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{shop.name}</h1>
          <p className="text-slate-500 mt-1">
            Created on{' '}
            {new Date(shop.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <ShopStatusToggle shopId={shop._id} currentStatus={shop.status} />
      </div>

      {/* Shop Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Status</p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              shop.status === 'active'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {shop.status === 'active' ? 'Active' : 'Suspended'}
          </span>
        </div>

        {/* Invite Code */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">
            Invite Code
          </p>
          <div className="flex items-center gap-2">
            <code className="text-lg font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
              {shop.inviteCode}
            </code>
            <CopyButton text={shop.inviteCode} />
          </div>
        </div>

        {/* Members Count */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Members</p>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-400" />
            <span className="text-lg font-bold text-slate-900">
              {members.length.toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Shop Members
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map(
                  (member: {
                    _id: string;
                    userId: string;
                    role: string;
                    isActive: boolean;
                    createdAt: string;
                  }) => (
                    <tr key={member._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-mono text-slate-600">
                        {member.userId}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.role === 'owner'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {member.role === 'owner' ? 'Owner' : 'Staff'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {member.isActive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(member.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
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
