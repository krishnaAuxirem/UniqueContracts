import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, TrendingUp, BarChart3, LineChart, Plus, FileText,
  ArrowUpRight, ArrowDownRight, DollarSign, Users, Zap, CheckCircle, Download
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getContracts, getAnalytics } from '@/lib/mockData';
import { formatCurrency, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const COMPETITOR_DATA = [
  { name: 'UniqueContracts', score: 94, contracts: 147, growth: '+12%', lead: true },
  { name: 'DocuSign', score: 88, contracts: 312, growth: '+5%', lead: false },
  { name: 'Juro', score: 76, contracts: 89, growth: '+8%', lead: false },
  { name: 'Zoho Contracts', score: 71, contracts: 67, growth: '+3%', lead: false },
];

const CAMPAIGN_DATA = [
  { name: 'Q1 Brand Partnerships', budget: 500000, spent: 320000, roi: 2.4, status: 'active' },
  { name: 'Influencer Campaign – Summer', budget: 200000, spent: 80000, roi: 3.1, status: 'active' },
  { name: 'SaaS Vendor Agreements', budget: 750000, spent: 750000, roi: 1.8, status: 'completed' },
  { name: 'Annual Legal Retainers', budget: 480000, spent: 120000, roi: 0, status: 'pending' },
];

const OPPORTUNITY_DATA = [
  { type: 'Renewal Due', count: 5, value: '₹12.5L', urgency: 'high' },
  { type: 'Upsell Candidates', count: 8, value: '₹8.2L', urgency: 'medium' },
  { type: 'Expired Contracts', count: 3, value: '₹4.1L', urgency: 'high' },
  { type: 'New Leads', count: 12, value: '₹22L', urgency: 'low' },
];

const PIE_DATA = [
  { name: 'Active', value: 89, color: '#10B981' },
  { name: 'Pending', value: 28, color: '#CF6DFC' },
  { name: 'Draft', value: 18, color: '#C1BFFF' },
  { name: 'Expired', value: 12, color: '#F59E0B' },
];

export default function BrandDashboard() {
  const user = getCurrentUser();
  const contracts = getContracts();
  const analytics = getAnalytics();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">
            Brand Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Market insights & contract portfolio for {user?.company || user?.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-xl hover:border-[#CF6DFC] transition-colors">
            <Download size={15} /> Export Report
          </button>
          <button onClick={() => navigate('/dashboard/editor')} className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md">
            <Plus size={16} /> New Contract
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Portfolio', value: formatCurrency(analytics.totalValue), icon: DollarSign, change: '+18%', positive: true, color: 'from-purple-500 to-violet-600' },
          { label: 'Active Contracts', value: String(analytics.activeContracts), icon: FileText, change: '+12 this month', positive: true, color: 'from-blue-500 to-cyan-600' },
          { label: 'Pending Actions', value: String(analytics.pendingSignatures), icon: Zap, change: 'Needs attention', positive: false, color: 'from-amber-500 to-orange-600' },
          { label: 'Completion Rate', value: `${analytics.completionRate}%`, icon: CheckCircle, change: '+5% vs last qtr', positive: true, color: 'from-green-500 to-emerald-600' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.positive ? 'text-green-500' : 'text-amber-500'}`}>
                  {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-heading font-bold text-[#111827] dark:text-white">{kpi.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Contract Value Trend */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Contract Value Trend</h3>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics.monthlyData}>
              <defs>
                <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CF6DFC" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#CF6DFC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, 'Value']} />
              <Area type="monotone" dataKey="value" stroke="#CF6DFC" strokeWidth={2} fill="url(#valueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Distribution */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-4">Portfolio Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Competitor Tracking */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Market Positioning</h3>
          </div>
          <div className="space-y-3">
            {COMPETITOR_DATA.map(c => (
              <div key={c.name} className={`p-3 rounded-xl border ${c.lead ? 'border-[#CF6DFC]/40 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-100 dark:border-gray-700'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{c.name}</span>
                    {c.lead && <span className="text-xs bg-[#CF6DFC] text-white px-2 py-0.5 rounded-full">You</span>}
                  </div>
                  <span className="text-xs text-green-500 font-semibold">{c.growth}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-2 rounded-full bg-gradient-to-r from-[#CF6DFC] to-[#C1BFFF]" style={{ width: `${c.score}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{c.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Planner */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-[#CF6DFC]" />
              <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Campaign Planner</h3>
            </div>
            <button className="text-xs text-[#CF6DFC] font-medium hover:underline">Add Campaign</button>
          </div>
          <div className="space-y-3">
            {CAMPAIGN_DATA.map(c => (
              <div key={c.name} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[200px]">{c.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : c.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>Budget: {formatCurrency(c.budget)}</span>
                  <span>Spent: {formatCurrency(c.spent)}</span>
                  {c.roi > 0 && <span className="text-green-500 font-medium">ROI: {c.roi}x</span>}
                </div>
                <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-[#CF6DFC] to-[#C1BFFF]" style={{ width: `${(c.spent / c.budget) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunity Detection */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-[#CF6DFC]" />
          <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Opportunity Detection</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OPPORTUNITY_DATA.map(op => (
            <div key={op.type} className={`p-4 rounded-xl border-2 ${op.urgency === 'high' ? 'border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/10' : op.urgency === 'medium' ? 'border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-900/10' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'} cursor-pointer hover:shadow-md transition-shadow`}>
              <div className="text-2xl font-heading font-bold text-[#111827] dark:text-white mb-1">{op.count}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{op.type}</div>
              <div className="text-sm font-semibold text-[#CF6DFC]">{op.value}</div>
              <div className={`mt-2 text-xs font-medium ${op.urgency === 'high' ? 'text-red-500' : op.urgency === 'medium' ? 'text-yellow-500' : 'text-green-500'} uppercase tracking-wide`}>
                {op.urgency} priority
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
