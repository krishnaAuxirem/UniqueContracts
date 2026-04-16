import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Bookmark, AlertCircle, BarChart3, Zap, Plus,
  Eye, Heart, Share2, Hash, Star, ArrowUpRight, Play, FileText
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getContracts, getAnalytics } from '@/lib/mockData';
import { formatCurrency, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TRENDING_TOPICS = [
  { topic: 'AI Contract Automation', growth: '+142%', category: 'Legal Tech', hot: true },
  { topic: 'Influencer Brand Deals', growth: '+89%', category: 'Marketing', hot: true },
  { topic: 'Remote Work Agreements', growth: '+67%', category: 'HR', hot: false },
  { topic: 'SaaS Subscription Terms', growth: '+54%', category: 'Technology', hot: false },
  { topic: 'Creator Economy Contracts', growth: '+48%', category: 'Creator', hot: true },
];

const HASHTAGS = [
  { tag: '#ContractLaw', posts: '24.2K', trending: true },
  { tag: '#InfluencerContract', posts: '18.7K', trending: true },
  { tag: '#BrandDeal', posts: '45.1K', trending: false },
  { tag: '#CreatorEconomy', posts: '112K', trending: true },
  { tag: '#LegalTech', posts: '31.5K', trending: false },
  { tag: '#ESignature', posts: '9.8K', trending: false },
];

const WATCHLIST = [
  { name: 'FreshBrew Partnership', value: '₹75K', status: 'pending_signature', daysLeft: 45 },
  { name: 'StyleCo Collab', value: '₹50K', status: 'draft', daysLeft: 90 },
  { name: 'TechApp Sponsorship', value: '₹1.2L', status: 'pending_review', daysLeft: 30 },
];

const PERFORMANCE_DATA = [
  { month: 'Oct', reach: 42000, engagement: 3800, deals: 2 },
  { month: 'Nov', reach: 58000, engagement: 5200, deals: 3 },
  { month: 'Dec', reach: 71000, engagement: 7100, deals: 4 },
  { month: 'Jan', reach: 89000, engagement: 8900, deals: 5 },
  { month: 'Feb', reach: 102000, engagement: 11200, deals: 6 },
  { month: 'Mar', reach: 128000, engagement: 14500, deals: 8 },
];

export default function CreatorDashboard() {
  const user = getCurrentUser();
  const contracts = getContracts().filter(c => c.createdBy === 'u1');
  const analytics = getAnalytics();
  const navigate = useNavigate();
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Welcome back, {user?.name.split(' ')[0]} 👋 Here's what's trending
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/editor')}
          className="flex items-center gap-2 px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md"
        >
          <Plus size={16} /> New Contract
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Deals', value: '8', icon: FileText, color: 'from-purple-500 to-violet-600', change: '+2 this month' },
          { label: 'Total Reach', value: '128K', icon: Eye, color: 'from-pink-500 to-rose-600', change: '+26% this month' },
          { label: 'Avg Engagement', value: '11.3%', icon: Heart, color: 'from-blue-500 to-cyan-600', change: '+3.2% increase' },
          { label: 'Deal Value', value: '₹4.2L', icon: Star, color: 'from-amber-500 to-orange-600', change: 'This quarter' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover-lift">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="text-2xl font-heading font-bold text-[#111827] dark:text-white">{kpi.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{kpi.label}</div>
              <div className="text-xs text-green-500 mt-1 font-medium">{kpi.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Performance Analytics</h3>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={PERFORMANCE_DATA}>
              <defs>
                <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CF6DFC" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#CF6DFC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="reach" stroke="#CF6DFC" strokeWidth={2} fill="url(#reach)" name="Reach" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trending Topics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Trending Topics</h3>
          </div>
          <div className="space-y-3">
            {TRENDING_TOPICS.map(t => (
              <div key={t.topic} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{t.topic}</p>
                    {t.hot && <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded-full">🔥</span>}
                  </div>
                  <p className="text-xs text-gray-400">{t.category}</p>
                </div>
                <span className="text-xs font-semibold text-green-500">{t.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hashtag Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Hash size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Hashtag Insights</h3>
          </div>
          <div className="space-y-2.5">
            {HASHTAGS.map(h => (
              <div key={h.tag} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#CF6DFC]">{h.tag}</span>
                  {h.trending && <ArrowUpRight size={12} className="text-green-500" />}
                </div>
                <span className="text-xs text-gray-400">{h.posts} posts</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">AI Content Ideas</h3>
          </div>
          <div className="space-y-3">
            {[
              'Create a thread explaining influencer contract essentials in 2025',
              'Post about protecting IP rights in brand collaboration deals',
              'Share your experience with AI-drafted NDAs vs traditional ones',
              'Video: Red flags to watch in sponsorship agreements',
            ].map((idea, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <Play size={12} className="text-[#CF6DFC] mt-1 shrink-0" />
                <p className="text-xs text-gray-700 dark:text-gray-300">{idea}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark size={16} className="text-[#CF6DFC]" />
            <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Deal Watchlist</h3>
          </div>
          <div className="space-y-3">
            {WATCHLIST.map(item => (
              <div key={item.name} className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#CF6DFC]/30 cursor-pointer transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[150px]">{item.name}</p>
                  <span className="text-sm font-semibold text-[#CF6DFC]">{item.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                  <span className="text-xs text-gray-400">{item.daysLeft}d left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Contracts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-heading font-semibold text-[#111827] dark:text-white">Recent Contracts</h3>
          <button onClick={() => navigate('/dashboard/contracts')} className="text-sm text-[#CF6DFC] hover:underline font-medium">View all</button>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {contracts.slice(0, 3).map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => navigate(`/dashboard/editor/${c.id}`)}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <FileText size={16} className="text-[#CF6DFC]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{c.title}</p>
                  <p className="text-xs text-gray-400">{c.type} · {formatDate(c.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {c.value && <span className="text-sm font-semibold text-[#CF6DFC]">{formatCurrency(c.value)}</span>}
                <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(c.status)}`}>{getStatusLabel(c.status)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
