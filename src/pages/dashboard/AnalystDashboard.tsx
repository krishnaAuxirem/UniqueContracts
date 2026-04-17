import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Download, BookOpen, GitBranch, Activity, Plus, AlertTriangle,
  TrendingUp, TrendingDown, CheckCircle, Clock, FileText, Filter
} from 'lucide-react';
import { getAnalytics, getContracts } from '@/lib/mockData';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, ReferenceLine
} from 'recharts';

const LIFECYCLE_DATA = [
  { stage: 'Draft', count: 18, avgDays: 3 },
  { stage: 'Review', count: 12, avgDays: 5 },
  { stage: 'Approval', count: 8, avgDays: 2 },
  { stage: 'Signing', count: 15, avgDays: 1 },
  { stage: 'Active', count: 89, avgDays: 365 },
];

const RISK_RADAR = [
  { subject: 'Payment', A: 72, fullMark: 100 },
  { subject: 'Liability', A: 45, fullMark: 100 },
  { subject: 'IP Rights', A: 60, fullMark: 100 },
  { subject: 'Termination', A: 80, fullMark: 100 },
  { subject: 'Compliance', A: 55, fullMark: 100 },
  { subject: 'Force Majeure', A: 35, fullMark: 100 },
];

const RISK_TREND = [
  { month: 'Oct', avgRisk: 38 },
  { month: 'Nov', avgRisk: 42 },
  { month: 'Dec', avgRisk: 35 },
  { month: 'Jan', avgRisk: 28 },
  { month: 'Feb', avgRisk: 31 },
  { month: 'Mar', avgRisk: 24 },
];

const APPROVAL_TIMELINE_DATA = [
  { contract: 'NDA – TechNova', submitted: 'Mar 10', approved: 'Mar 11', days: 1, status: 'approved' },
  { contract: 'Service – GrowFast', submitted: 'Mar 12', approved: 'Mar 15', days: 3, status: 'approved' },
  { contract: 'Employment – New Hire', submitted: 'Mar 14', approved: 'Mar 19', days: 5, status: 'approved' },
  { contract: 'Retainer – LegalFirst', submitted: 'Mar 18', approved: null, days: 8, status: 'pending' },
  { contract: 'Partnership – DataVault', submitted: 'Mar 20', approved: null, days: 6, status: 'pending' },
  { contract: 'Influencer – StyleCo', submitted: 'Mar 22', approved: null, days: 4, status: 'review' },
];

const RESEARCH_NOTES = [
  { id: 1, title: 'Q1 Contract Velocity Analysis', date: '2025-03-10', tags: ['analytics', 'Q1'], content: 'Avg signing time dropped to 2.4 days from 4.1 days in Q4 2024.' },
  { id: 2, title: 'Risk Pattern in Tech Contracts', date: '2025-03-05', tags: ['risk', 'tech'], content: 'IP clauses missing in 34% of SaaS agreements reviewed this quarter.' },
  { id: 3, title: 'Renewal Rate Trends', date: '2025-02-28', tags: ['renewals', 'trends'], content: 'Contracts with 30-day renewal reminders show 78% renewal rate vs 45% without.' },
];

const HIGH_RISK_CONTRACTS = [
  { id: 'r1', title: 'Partnership Agreement – DataVault Intl', riskScore: 74, issues: ['Missing liability cap', 'Vague IP ownership', 'No force majeure'], type: 'Partnership' },
  { id: 'r2', title: 'Employment Contract – Senior Dev', riskScore: 58, issues: ['Non-compete too broad', 'IP assignment ambiguous'], type: 'Employment' },
  { id: 'r3', title: 'Service Agreement – MedTech India', riskScore: 51, issues: ['Payment terms unclear', 'No SLA penalties'], type: 'Service' },
];

export default function AnalystDashboard() {
  const analytics = getAnalytics();
  const contracts = getContracts();
  const navigate = useNavigate();
  const [noteOpen, setNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'risk' | 'timeline' | 'export'>('overview');

  const handleExportCSV = () => {
    const headers = ['Title', 'Type', 'Status', 'Value', 'Risk Score', 'Created'];
    const rows = contracts.map(c => [c.title, c.type, c.status, c.value || '', c.riskScore || '', c.createdAt]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'contracts-export.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handleExportPDF = () => {
    const content = `
UniqueContracts — Analytics Report
Generated: ${new Date().toLocaleDateString('en-IN')}
======================================
SUMMARY
Total Contracts: ${analytics.totalContracts}
Active Contracts: ${analytics.activeContracts}
Avg Signing Time: ${analytics.avgSigningTime} days
Completion Rate: ${analytics.completionRate}%
Expiring Soon: ${analytics.expiringSoon}

CONTRACT LIST
${contracts.map(c => `• ${c.title} | ${c.type} | ${c.status} | Risk: ${c.riskScore || 'N/A'}`).join('\n')}
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'analytics-report.txt'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  const VIEWS = [
    { id: 'overview', label: 'Overview' },
    { id: 'risk', label: 'Risk Dashboard' },
    { id: 'timeline', label: 'Approval Timeline' },
    { id: 'export', label: 'Export Data' },
  ] as const;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Analyst Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Deep contract intelligence & research tools</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl hover:border-[#CF6DFC] transition-colors text-gray-600 dark:text-gray-300">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm rounded-xl hover:border-[#CF6DFC] transition-colors text-gray-600 dark:text-gray-300">
            <FileText size={15} /> Export Report
          </button>
          <button onClick={() => navigate('/dashboard/editor')} className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md">
            <Plus size={16} /> New Contract
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === v.id ? 'bg-white dark:bg-gray-700 text-[#CF6DFC] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}>{v.label}</button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Contracts', value: String(analytics.totalContracts), sub: '+23 this month', color: 'from-purple-500 to-violet-600', trend: 'up' },
          { label: 'Avg Signing Time', value: `${analytics.avgSigningTime}d`, sub: '-1.7d from last period', color: 'from-blue-500 to-cyan-600', trend: 'down' },
          { label: 'Completion Rate', value: `${analytics.completionRate}%`, sub: '+5% vs benchmark', color: 'from-green-500 to-emerald-600', trend: 'up' },
          { label: 'Expiring (90d)', value: String(analytics.expiringSoon), sub: 'Need attention', color: 'from-amber-500 to-orange-600', trend: 'warning' },
        ].map(k => (
          <div key={k.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover-lift">
            <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${k.color} mb-3`} />
            <div className="flex items-center justify-between">
              <div className="text-2xl font-heading font-bold text-[#111827] dark:text-white">{k.value}</div>
              {k.trend === 'up' ? <TrendingUp size={16} className="text-green-500" /> : k.trend === 'down' ? <TrendingDown size={16} className="text-green-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
            <div className={`text-xs font-medium mt-1 ${k.trend === 'warning' ? 'text-amber-500' : 'text-green-500'}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-[#CF6DFC]" />
                <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Contract Lifecycle Funnel</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={LIFECYCLE_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={65} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#CF6DFC" radius={[0,4,4,0]} name="Contracts" />
                </BarChart>
              </ResponsiveContainer>
            </div>

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
            {/* Pattern Detection */}
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
                  { pattern: 'Multi-party contracts: 18% higher risk score', severity: 'warning', impact: 'Review needed' },
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
                  <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Write your research note..." className="w-full text-sm bg-transparent border-none outline-none resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400" rows={3} />
                  <button onClick={() => { setNoteOpen(false); setNewNote(''); toast.success('Note saved'); }} className="text-xs text-[#CF6DFC] font-semibold">Save Note</button>
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
            </div>
          </div>
        </div>
      )}

      {/* ── Risk Dashboard ── */}
      {activeView === 'risk' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Risk Radar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} className="text-amber-500" />
                <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Risk Indicator Radar</h3>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={RISK_RADAR}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Risk Score" dataKey="A" stroke="#CF6DFC" fill="#CF6DFC" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-400 mt-2">Higher scores indicate stronger contract protection</p>
            </div>

            {/* Risk Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown size={16} className="text-green-500" />
                <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Avg Risk Score Trend</h3>
                <span className="ml-auto text-xs text-green-500 font-semibold">↓ 37% improvement</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={RISK_TREND}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <ReferenceLine y={30} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Target', fontSize: 10, fill: '#F59E0B' }} />
                  <Area type="monotone" dataKey="avgRisk" stroke="#EF4444" strokeWidth={2} fill="url(#riskGrad)" name="Avg Risk" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* High Risk Contracts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-red-500" />
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white">High Risk Contracts — Immediate Attention</h3>
            </div>
            <div className="space-y-4">
              {HIGH_RISK_CONTRACTS.map(c => (
                <div key={c.id} className={`p-4 rounded-2xl border-2 ${c.riskScore >= 70 ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : c.riskScore >= 50 ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/10' : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10'}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.type}</p>
                    </div>
                    <div className="text-center shrink-0">
                      <div className={`text-2xl font-extrabold ${c.riskScore >= 70 ? 'text-red-600' : c.riskScore >= 50 ? 'text-amber-600' : 'text-yellow-600'}`}>{c.riskScore}</div>
                      <div className="text-xs text-gray-400">Risk Score</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {c.issues.map(issue => (
                      <span key={issue} className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg">{issue}</span>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${c.riskScore}%`, background: c.riskScore >= 70 ? '#EF4444' : c.riskScore >= 50 ? '#F59E0B' : '#EAB308' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Approval Timeline ── */}
      {activeView === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Clock size={16} className="text-[#CF6DFC]" />
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Approval Timeline Tracker</h3>
            </div>
            <div className="space-y-4">
              {APPROVAL_TIMELINE_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${item.status === 'approved' ? 'bg-green-500' : item.status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.contract}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">Submitted: {item.submitted}</span>
                      {item.approved && <span className="text-xs text-green-500">→ Approved: {item.approved}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-32">
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <div className={`h-2 rounded-full ${item.status === 'approved' ? 'bg-green-500' : item.status === 'pending' ? 'bg-amber-400' : 'bg-blue-400'}`} style={{ width: `${Math.min((item.days / 10) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-10 text-right">{item.days}d</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Avg Approval Time', value: '3.2 days', sub: 'Down from 4.8 days', color: 'text-green-600', icon: TrendingDown },
              { label: 'Fastest Approval', value: '1 day', sub: 'NDA contracts', color: 'text-blue-600', icon: CheckCircle },
              { label: 'Overdue Reviews', value: '2', sub: 'Requires escalation', color: 'text-red-600', icon: AlertTriangle },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center">
                  <Icon size={24} className={`${s.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-heading font-extrabold ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Export Panel ── */}
      {activeView === 'export' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-2">Export Contract Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Export your contract portfolio in multiple formats for external analysis.</p>
            <div className="space-y-3">
              {[
                { label: 'CSV Export', desc: 'All contracts with metadata — compatible with Excel & Google Sheets', icon: '📊', action: handleExportCSV, color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700' },
                { label: 'PDF Report', desc: 'Formatted analytics report with charts and summary', icon: '📄', action: handleExportPDF, color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700' },
                { label: 'JSON Export', desc: 'Raw contract data in JSON format for API integrations', icon: '🔧', action: () => toast.success('JSON export ready'), color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700' },
              ].map(e => (
                <div key={e.label} className={`p-4 rounded-xl border ${e.color} cursor-pointer hover:shadow-md transition-all`} onClick={e.action}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{e.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{e.label}</p>
                      <p className="text-xs opacity-70 mt-0.5">{e.desc}</p>
                    </div>
                    <Download size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-2">Custom Report Builder</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Configure what data to include in your report.</p>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Contract Summary Table', checked: true },
                { label: 'Risk Analysis Report', checked: true },
                { label: 'Approval Timeline Chart', checked: true },
                { label: 'Financial Overview', checked: false },
                { label: 'Expiry Forecast', checked: true },
                { label: 'Signatory Status', checked: false },
              ].map(opt => (
                <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${opt.checked ? 'bg-[#CF6DFC] border-[#CF6DFC]' : 'border-gray-300 dark:border-gray-600 group-hover:border-[#CF6DFC]'}`}>
                    {opt.checked && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <select className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300 outline-none">
                <option>Date Range: Last 30 days</option>
                <option>Date Range: Last 90 days</option>
                <option>Date Range: This year</option>
                <option>Date Range: All time</option>
              </select>
              <button onClick={handleExportPDF} className="px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md">Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
