import { useState } from 'react';
import { Users, Shield, Activity, BarChart3, BookOpen, Settings, Trash2, Edit, UserCog, CheckCircle, XCircle } from 'lucide-react';
import { getAllUsers, deleteUser, updateUserRole } from '@/lib/auth';
import { getAnalytics, getContracts, BLOG_POSTS } from '@/lib/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { UserRole } from '@/types';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const ACTIVITY_LOGS = [
  { id: 1, user: 'Priya Sharma', action: 'Created contract "Annual Retainer – LegalFirst"', time: '2 min ago', type: 'create' },
  { id: 2, user: 'Aryan Kapoor', action: 'Signed "Influencer Marketing Campaign – FreshBrew"', time: '15 min ago', type: 'sign' },
  { id: 3, user: 'Rohit Mehta', action: 'Exported contract analytics report (PDF)', time: '1 hour ago', type: 'export' },
  { id: 4, user: 'Admin User', action: 'Updated role for user "new_user@test.com" to Brand', time: '3 hours ago', type: 'admin' },
  { id: 5, user: 'System', action: 'Auto-reminder sent for 3 expiring contracts', time: '6 hours ago', type: 'system' },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(getAllUsers());
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'logs' | 'blog'>('users');
  const analytics = getAnalytics();
  const contracts = getContracts();

  const handleDelete = (id: string) => {
    deleteUser(id);
    setUsers(getAllUsers());
    toast.success('User removed');
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
    setUsers(getAllUsers());
    toast.success('Role updated');
  };

  const TABS = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
    { id: 'blog', label: 'Blog Management', icon: BookOpen },
  ] as const;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Admin Control Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Full system oversight and management</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <Shield size={14} className="text-red-500" />
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">Admin Access</span>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: String(users.length), color: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-[#CF6DFC]' },
          { label: 'Total Contracts', value: String(analytics.totalContracts), color: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600' },
          { label: 'Active This Month', value: String(analytics.activeContracts), color: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600' },
          { label: 'Pending Review', value: String(analytics.pendingSignatures), color: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 border border-transparent`}>
            <div className={`text-3xl font-heading font-extrabold ${s.text}`}>{s.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-white dark:bg-gray-700 text-[#CF6DFC] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* User Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Registered Users ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['User', 'Email', 'Role', 'Plan', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-medium text-gray-800 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 text-[#CF6DFC] rounded-lg focus:outline-none"
                      >
                        <option value="creator">Creator</option>
                        <option value="brand">Brand</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.plan === 'enterprise' ? 'bg-amber-100 text-amber-600' : u.plan === 'pro' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(u.lastLogin)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">Monthly Contracts</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="contracts" fill="#CF6DFC" radius={[4, 4, 0, 0]} name="Created" />
                <Bar dataKey="signed" fill="#C1BFFF" radius={[4, 4, 0, 0]} name="Signed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">User Roles Distribution</h3>
            <div className="space-y-3 mt-6">
              {[
                { role: 'Brand / Business', count: users.filter(u => u.role === 'brand').length, color: 'bg-blue-400' },
                { role: 'Creator / Influencer', count: users.filter(u => u.role === 'creator').length, color: 'bg-[#CF6DFC]' },
                { role: 'Analyst', count: users.filter(u => u.role === 'analyst').length, color: 'bg-green-400' },
                { role: 'Admin', count: users.filter(u => u.role === 'admin').length, color: 'bg-red-400' },
              ].map(r => (
                <div key={r.role} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-36">{r.role}</span>
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className={`h-3 rounded-full ${r.color}`} style={{ width: `${Math.max((r.count / users.length) * 100, 5)}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-6">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">System Activity Logs</h3>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {ACTIVITY_LOGS.map(log => (
              <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.type === 'create' ? 'bg-purple-100 dark:bg-purple-900/30' : log.type === 'sign' ? 'bg-green-100 dark:bg-green-900/30' : log.type === 'admin' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  {log.type === 'sign' ? <CheckCircle size={14} className="text-green-500" /> : log.type === 'admin' ? <UserCog size={14} className="text-red-500" /> : <Activity size={14} className="text-gray-500" />}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">{log.user}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400"> — {log.action}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Management */}
      {activeTab === 'blog' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Blog Posts ({BLOG_POSTS.length})</h3>
            <button className="text-sm text-white gradient-primary px-4 py-2 rounded-lg font-medium">+ New Post</button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {BLOG_POSTS.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.author} · {post.category} · {formatDate(post.publishedAt)}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {post.featured && <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">Featured</span>}
                  <button className="p-1.5 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Edit size={14} /></button>
                  <button className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
