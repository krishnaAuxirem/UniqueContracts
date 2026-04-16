import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Download, BookOpen, GitBranch, Activity, Plus, FileText } from 'lucide-react';
import { getAnalytics, getContracts } from '@/lib/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';

const LIFECYCLE_DATA = [
  { stage: 'Draft', count: 18, avgDays: 3, color: '#C1BFFF' },
  { stage: 'Review', count: 12, avgDays: 5, color: '#CF6DFC' },
  { stage: 'Approval', count: 8, avgDays: 2, color: '#BDB96A' },
  { stage: 'Signing', count: 15, avgDays: 1, color: '#10B981' },
  { stage: 'Active', count: 89, avgDays: 365, color: '#3B82F6' },
];

const PATTERN_DATA = [
  { x: 10, y: 30, z: 200, name: 'NDA' },
  { x: 40, y: 60, z: 400, name: 'Service' },
  { x: 25, y: 45, z: 300, name: 'Employment' },
  { x: 60, y: 80, z: 600, name: 'Partnership' },
  { x: 35, y: 55, z: 350, name: 'Influencer' },
];

const RESEARCH_NOTES = [
  { id: 1, title: 'Q1 Contract Velocity Analysis', date: '2025-03-10', tags: ['analytics', 'Q1'], content: 'Avg signing time dropped to 2.4 days from 4.1 days in Q4 2024.' },
  { id: 2, title: 'Risk Pattern in Tech Contracts', date: '2025-03-05', tags: ['risk', 'tech'], content: 'IP clauses missing in 34% of SaaS agreements reviewed this quarter.' },
  { id: 3, title: 'Renewal Rate Trends', date: '2025-02-28', tags: ['renewals', 'trends'], content: 'Contracts with 30-day renewal reminders show 78% renewal rate vs 45% without.' },
];

export default function AnalystDashboard() {
  const analytics = getAnalytics();
  const contracts = getContracts();
  const navigate = useNavigate();
  const [noteOpen, setNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Analyst Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Deep contract intelligence & research tools</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl hover:border-[#CF6DFC] transition-colors text-gray-600 dark:text-gray-300">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => navigate('/dashboard/editor')} className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md">
            <Plus size={16} /> New Contract
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Contracts', value: String(analytics.totalContracts), sub: '+23 this month', color: 'from-purple-500 to-violet-600' },
          { label: 'Avg Signing Time', value: `${analytics.avgSigningTime}d`, sub: '-1.7d from last period', color: 'from-blue-500 to-cyan-600' },
          { label: 'Completion Rate', value: `${analytics.completionRate}%`, sub: '+5% vs benchmark', color: 'from-green-500 to-emerald-600' },
          { label: 'Expiring (90d)', value: String(analytics.expiringSoon), sub: 'Need attention', color: 'from-amber-500 to-orange-600' },
        ].map(k => (
          <div key={k.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${k.color} mb-3`} />
            <div className="text-2xl font-heading font-bold text-[#111827] dark:text-white">{k.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            <div className="text-xs text-green-500 font-medium mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trend Lifecycle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Contract Lifecycle Funnel</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={LIFECYCLE_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Bar dataKey="count" fill="#CF6DFC" radius={[0, 4, 4, 0]} name="Contracts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Monthly Volume</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="contracts" stroke="#CF6DFC" strokeWidth={2} dot={{ fill: '#CF6DFC', r: 4 }} name="Created" />
              <Line type="monotone" dataKey="signed" stroke="#C1BFFF" strokeWidth={2} dot={{ fill: '#C1BFFF', r: 4 }} name="Signed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deep Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Pattern Detection</h3>
          </div>
          <div className="space-y-3">
            {[
              { pattern: 'Late signature rate spikes on Fridays', severity: 'info', impact: 'Delay risk: 23%' },
              { pattern: 'NDA contracts have 2.1x faster approval', severity: 'positive', impact: 'Benchmark gap: +45%' },
              { pattern: 'Contracts >₹5L take 4.2x longer to sign', severity: 'warning', impact: 'Process bottleneck' },
              { pattern: 'Multi-party contracts have 18% higher risk score', severity: 'warning', impact: 'Review needed' },
            ].map(p => (
              <div key={p.pattern} className={`p-3 rounded-xl border ${p.severity === 'positive' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : p.severity === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10' : 'border-blue-200 bg-blue-50 dark:bg-blue-900/10'}`}>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{p.pattern}</p>
                <p className={`text-xs font-medium ${p.severity === 'positive' ? 'text-green-600' : p.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`}>{p.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Research Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#CF6DFC]" />
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Research Notes</h3>
            </div>
            <button onClick={() => setNoteOpen(!noteOpen)} className="text-xs text-[#CF6DFC] font-medium hover:underline">+ Add Note</button>
          </div>
          {noteOpen && (
            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Write your research note..."
                className="w-full text-sm bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                rows={3}
              />
              <button onClick={() => { setNoteOpen(false); setNewNote(''); }} className="text-xs text-[#CF6DFC] font-semibold">Save Note</button>
            </div>
          )}
          <div className="space-y-3">
            {RESEARCH_NOTES.map(n => (
              <div key={n.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{n.title}</p>
                  <span className="text-xs text-gray-400">{formatDate(n.date)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{n.content}</p>
                <div className="flex gap-1">
                  {n.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] rounded-full">#{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-sm text-[#CF6DFC] font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
            <Download size={14} /> Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
