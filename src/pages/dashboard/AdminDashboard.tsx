import { useState } from 'react';
import {
  Users, Shield, Activity, BarChart3, BookOpen, Settings, Trash2, Edit,
  UserCog, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, ToggleLeft,
  ToggleRight, Flag, MessageSquare, FileText, Clock, Bell
} from 'lucide-react';
import { getAllUsers, deleteUser, updateUserRole } from '@/lib/auth';
import { getAnalytics, getContracts, BLOG_POSTS } from '@/lib/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { UserRole } from '@/types';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ACTIVITY_LOGS = [
  { id: 1, user: 'Priya Sharma', action: 'Created contract "Annual Retainer – LegalFirst"', time: '2 min ago', type: 'create' },
  { id: 2, user: 'Aryan Kapoor', action: 'Signed "Influencer Marketing Campaign – FreshBrew"', time: '15 min ago', type: 'sign' },
  { id: 3, user: 'Rohit Mehta', action: 'Exported contract analytics report (PDF)', time: '1 hour ago', type: 'export' },
  { id: 4, user: 'Admin User', action: 'Updated role for user "new_user@test.com" to Brand', time: '3 hours ago', type: 'admin' },
  { id: 5, user: 'System', action: 'Auto-reminder sent for 3 expiring contracts', time: '6 hours ago', type: 'system' },
  { id: 6, user: 'Nisha Patel', action: 'Raised a moderation flag on blog post "AI Contracts Risks"', time: '8 hours ago', type: 'flag' },
  { id: 7, user: 'System', action: 'Password reset email sent to kiran@techco.in', time: '1 day ago', type: 'system' },
  { id: 8, user: 'Admin User', action: 'Deleted expired contracts (batch cleanup, 7 items)', time: '2 days ago', type: 'admin' },
];

interface ModerationItem {
  id: string;
  type: 'comment' | 'contract' | 'blog';
  title: string;
  author: string;
  reason: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  flaggedAt: string;
}

const MODERATION_QUEUE: ModerationItem[] = [
  { id: 'm1', type: 'blog', title: 'AI Can Replace Lawyers — Here\'s How', author: 'External Writer', reason: 'Misleading legal advice', content: 'This article makes unsubstantiated claims about AI replacing legal professionals...', status: 'pending', flaggedAt: '2025-04-15' },
  { id: 'm2', type: 'comment', title: 'Comment on NDA Best Practices', author: 'new_user@test.com', reason: 'Spam / promotional content', content: 'Check out my contract templates at externalsite.com — best deals guaranteed!', status: 'pending', flaggedAt: '2025-04-14' },
  { id: 'm3', type: 'contract', title: 'Suspicious NDA Template Upload', author: 'anon_user_22', reason: 'Contains prohibited clauses', content: 'Template includes non-compete clause spanning 10 years across all industries globally...', status: 'pending', flaggedAt: '2025-04-13' },
  { id: 'm4', type: 'blog', title: 'How to Avoid Contract Taxes Legally', author: 'Priya K.', reason: 'Potentially misleading financial advice', content: 'This post suggests methods that may constitute tax evasion...', status: 'approved', flaggedAt: '2025-04-10' },
];

interface SystemConfig {
  maintenanceMode: boolean;
  newRegistrations: boolean;
  aiFeatures: boolean;
  emailNotifications: boolean;
  twoFactorRequired: boolean;
  autoContractBackup: boolean;
  maxContractSize: number;
  sessionTimeout: number;
  watermarkContracts: boolean;
  publicApiAccess: boolean;
}

const DEFAULT_CONFIG: SystemConfig = {
  maintenanceMode: false,
  newRegistrations: true,
  aiFeatures: true,
  emailNotifications: true,
  twoFactorRequired: false,
  autoContractBackup: true,
  maxContractSize: 10,
  sessionTimeout: 60,
  watermarkContracts: false,
  publicApiAccess: false,
};

const APPROVAL_TIMELINE = [
  { name: 'NDA', avg: 1.2, benchmark: 2 },
  { name: 'Service', avg: 3.4, benchmark: 4 },
  { name: 'Employment', avg: 5.1, benchmark: 6 },
  { name: 'Partnership', avg: 7.2, benchmark: 8 },
  { name: 'Influencer', avg: 2.8, benchmark: 3 },
];

const RISK_DIST = [
  { name: 'Low Risk', value: 58, color: '#10B981' },
  { name: 'Medium', value: 31, color: '#F59E0B' },
  { name: 'High Risk', value: 11, color: '#EF4444' },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState(getAllUsers());
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'logs' | 'blog' | 'moderation' | 'config'>('users');
  const [modQueue, setModQueue] = useState<ModerationItem[]>(MODERATION_QUEUE);
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const analytics = getAnalytics();

  const handleDelete = (id: string) => { deleteUser(id); setUsers(getAllUsers()); toast.success('User removed'); };
  const handleRoleChange = (userId: string, role: UserRole) => { updateUserRole(userId, role); setUsers(getAllUsers()); toast.success('Role updated'); };
  const handleMod = (id: string, action: 'approved' | 'rejected') => {
    setModQueue(prev => prev.map(m => m.id === id ? { ...m, status: action } : m));
    toast.success(`Content ${action === 'approved' ? 'approved and published' : 'rejected and removed'}`);
  };
  const toggleConfig = (key: keyof SystemConfig) => {
    if (typeof config[key] === 'boolean') {
      setConfig(prev => ({ ...prev, [key]: !prev[key] }));
      toast.success(`Setting updated`);
    }
  };

  const TABS = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Audit Logs', icon: Activity },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'moderation', label: 'Moderation', icon: Flag },
    { id: 'config', label: 'Config', icon: Settings },
  ] as const;

  const pendingModCount = modQueue.filter(m => m.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Admin Control Panel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Full system oversight and management</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingModCount > 0 && (
            <button onClick={() => setActiveTab('moderation')} className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <Flag size={13} className="text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{pendingModCount} pending review</span>
            </button>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <Shield size={14} className="text-red-500" />
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">Admin Access</span>
          </div>
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
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <div className={`text-3xl font-heading font-extrabold ${s.text}`}>{s.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors relative ${activeTab === t.id ? 'bg-white dark:bg-gray-700 text-[#CF6DFC] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              <Icon size={13} /> {t.label}
              {t.id === 'moderation' && pendingModCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">{pendingModCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── User Management ── */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Registered Users ({users.length})</h3>
            <button className="text-xs gradient-primary text-white px-3 py-1.5 rounded-lg font-medium">+ Invite User</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>{['User', 'Email', 'Role', 'Plan', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}</tr>
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
                      <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value as UserRole)} className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 text-[#CF6DFC] rounded-lg focus:outline-none">
                        <option value="creator">Creator</option>
                        <option value="brand">Brand</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.plan === 'enterprise' ? 'bg-amber-100 text-amber-600' : u.plan === 'pro' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>{u.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{formatDate(u.lastLogin)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">Monthly Contracts</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="contracts" fill="#CF6DFC" radius={[4,4,0,0]} name="Created" />
                  <Bar dataKey="signed" fill="#C1BFFF" radius={[4,4,0,0]} name="Signed" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Approval Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={15} className="text-[#CF6DFC]" />
                <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Avg Approval Timeline (days)</h3>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={APPROVAL_TIMELINE} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip />
                  <Bar dataKey="avg" fill="#CF6DFC" radius={[0,4,4,0]} name="Actual" />
                  <Bar dataKey="benchmark" fill="#E9D5FF" radius={[0,4,4,0]} name="Benchmark" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Risk Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">Risk Indicator Distribution</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={RISK_DIST} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {RISK_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {RISK_DIST.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Role Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">User Roles</h3>
              <div className="space-y-3 mt-4">
                {[
                  { role: 'Brand / Business', count: users.filter(u => u.role === 'brand').length, color: 'bg-blue-400' },
                  { role: 'Creator / Influencer', count: users.filter(u => u.role === 'creator').length, color: 'bg-[#CF6DFC]' },
                  { role: 'Analyst', count: users.filter(u => u.role === 'analyst').length, color: 'bg-green-400' },
                  { role: 'Admin', count: users.filter(u => u.role === 'admin').length, color: 'bg-red-400' },
                ].map(r => (
                  <div key={r.role} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-28 truncate">{r.role}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <div className={`h-2.5 rounded-full ${r.color}`} style={{ width: `${Math.max((r.count / users.length) * 100, 5)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-5">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">System Health</h3>
              <div className="space-y-3">
                {[
                  { label: 'API Uptime', value: '99.97%', status: 'good' },
                  { label: 'DB Response', value: '42ms', status: 'good' },
                  { label: 'Storage Used', value: '67%', status: 'medium' },
                  { label: 'Error Rate', value: '0.03%', status: 'good' },
                  { label: 'Active Sessions', value: '1,247', status: 'good' },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${m.status === 'good' ? 'bg-green-400' : m.status === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{m.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Activity Logs ── */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">System Audit Trail</h3>
            <button className="text-xs text-[#CF6DFC] border border-[#CF6DFC] px-3 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium">Export Logs</button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {ACTIVITY_LOGS.map(log => (
              <div key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.type === 'create' ? 'bg-purple-100 dark:bg-purple-900/30' : log.type === 'sign' ? 'bg-green-100 dark:bg-green-900/30' : log.type === 'admin' ? 'bg-red-100 dark:bg-red-900/30' : log.type === 'flag' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {log.type === 'sign' ? <CheckCircle size={14} className="text-green-500" /> : log.type === 'admin' ? <UserCog size={14} className="text-red-500" /> : log.type === 'flag' ? <Flag size={14} className="text-amber-500" /> : <Activity size={14} className="text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{log.user}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400"> — {log.action}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{log.time}</span>
                </div>
                {expandedLog === log.id && (
                  <div className="px-4 pb-4 ml-12">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-xs text-gray-500 dark:text-gray-400 font-mono space-y-1">
                      <div>Event ID: EVT-{log.id.toString().padStart(6, '0')}</div>
                      <div>IP Address: 192.168.{log.id}.{log.id * 7}</div>
                      <div>User Agent: Chrome/124.0 · Bengaluru, IN</div>
                      <div>Status: <span className="text-green-500">SUCCESS</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Blog Management ── */}
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
                  <button className="p-1.5 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"><Edit size={14} /></button>
                  <button className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Content Moderation ── */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {(['pending', 'approved', 'rejected'] as const).map(status => (
                <span key={status} className={`text-xs px-3 py-1 rounded-full font-medium ${status === 'pending' ? 'bg-amber-100 text-amber-700' : status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {modQueue.filter(m => m.status === status).length} {status}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {modQueue.map(item => (
              <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 ${item.status === 'pending' ? 'border-amber-200 dark:border-amber-800' : item.status === 'approved' ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.type === 'blog' ? 'bg-blue-100 text-blue-700' : item.type === 'comment' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.type}
                    </span>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white">{item.title}</h4>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' : item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                  <span><strong>Author:</strong> {item.author}</span>
                  <span><strong>Flagged for:</strong> {item.reason}</span>
                  <span><strong>Date:</strong> {formatDate(item.flaggedAt)}</span>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{item.content}"</p>
                </div>
                {item.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleMod(item.id, 'approved')} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 transition-colors">
                      <CheckCircle size={13} /> Approve & Publish
                    </button>
                    <button onClick={() => handleMod(item.id, 'rejected')} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-xl hover:bg-red-600 transition-colors">
                      <XCircle size={13} /> Reject & Remove
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-xl hover:bg-gray-200 transition-colors">
                      <Eye size={13} /> View Full
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── System Configuration ── */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Toggle Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">Platform Settings</h3>
              <div className="space-y-4">
                {([
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Block all user access during maintenance', icon: AlertTriangle, danger: true },
                  { key: 'newRegistrations', label: 'New Registrations', desc: 'Allow new users to register', icon: Users },
                  { key: 'aiFeatures', label: 'AI Features', desc: 'Enable AI contract analysis and drafting', icon: Settings },
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send system emails to users', icon: Bell },
                  { key: 'twoFactorRequired', label: 'Require 2FA', desc: 'Force all users to enable 2FA', icon: Shield },
                  { key: 'autoContractBackup', label: 'Auto Backup', desc: 'Daily contract data backups to cloud', icon: FileText },
                  { key: 'watermarkContracts', label: 'Watermark Drafts', desc: 'Add watermark to draft contracts', icon: Eye },
                  { key: 'publicApiAccess', label: 'Public API Access', desc: 'Allow external API integrations', icon: Settings },
                ] as const).map(setting => {
                  const Icon = setting.icon;
                  const val = config[setting.key];
                  return (
                    <div key={setting.key} className={`flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700 last:border-0 ${setting.danger && val ? 'bg-red-50 dark:bg-red-900/10 -mx-5 px-5 rounded-xl' : ''}`}>
                      <div className="flex items-center gap-3">
                        <Icon size={15} className={setting.danger ? 'text-red-500' : 'text-gray-400'} />
                        <div>
                          <p className={`text-sm font-medium ${setting.danger && val ? 'text-red-700 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>{setting.label}</p>
                          <p className="text-xs text-gray-400">{setting.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleConfig(setting.key)} className={`w-11 h-6 rounded-full transition-all relative shrink-0 ${val ? (setting.danger ? 'bg-red-500' : 'bg-[#CF6DFC]') : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${val ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Numeric Settings */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">Limits & Thresholds</h3>
                <div className="space-y-4">
                  {([
                    { key: 'maxContractSize', label: 'Max Contract Size (MB)', min: 1, max: 50, step: 1 },
                    { key: 'sessionTimeout', label: 'Session Timeout (minutes)', min: 15, max: 480, step: 15 },
                  ] as const).map(s => (
                    <div key={s.key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.label}</label>
                        <span className="text-sm font-bold text-[#CF6DFC]">{config[s.key]}</span>
                      </div>
                      <input type="range" min={s.min} max={s.max} step={s.step} value={config[s.key] as number}
                        onChange={e => setConfig(prev => ({ ...prev, [s.key]: Number(e.target.value) }))}
                        className="w-full accent-[#CF6DFC]" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{s.min}</span><span>{s.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">Notification Templates</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Expiry Reminder Email', days: '90 / 30 / 7 days' },
                    { label: 'Signature Request SMS', days: 'On trigger' },
                    { label: 'Approval Overdue Alert', days: 'After 24h' },
                    { label: 'Welcome Email', days: 'On registration' },
                  ].map(t => (
                    <div key={t.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.label}</p>
                        <p className="text-xs text-gray-400">{t.days}</p>
                      </div>
                      <button onClick={() => toast.success('Template editor coming soon')} className="text-xs text-[#CF6DFC] hover:underline">Edit</button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => toast.success('Configuration saved successfully')} className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 shadow-md transition-all">
                Save All Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
