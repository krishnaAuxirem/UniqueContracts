import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, PenTool, BarChart3, Bell, Settings,
  ChevronLeft, ChevronRight, TrendingUp, Bookmark, AlertCircle,
  Users, Shield, Activity, BookOpen, Zap, Search, GitBranch,
  Target, LineChart, Database, UserCog, LogOut, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { logout } from '@/lib/auth';

interface SidebarProps { user: User; }

const roleMenus = {
  creator: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/creator', color: 'text-purple-500' },
    { label: 'My Contracts', icon: FileText, path: '/dashboard/contracts', color: 'text-blue-500' },
    { label: 'Trending Topics', icon: TrendingUp, path: '/dashboard/creator', color: 'text-coral-500' },
    { label: 'AI Suggestions', icon: Zap, path: '/dashboard/creator', color: 'text-amber-500' },
    { label: 'Watchlist', icon: Bookmark, path: '/dashboard/creator', color: 'text-teal-500' },
    { label: 'Alerts', icon: AlertCircle, path: '/dashboard/creator', color: 'text-rose-500' },
    { label: 'Performance', icon: BarChart3, path: '/dashboard/creator', color: 'text-indigo-500' },
    { label: 'Contract Editor', icon: PenTool, path: '/dashboard/editor', color: 'text-pink-500' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications', color: 'text-orange-500' },
    { label: 'Profile', icon: Settings, path: '/dashboard/profile', color: 'text-gray-500' },
  ],
  brand: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/brand', color: 'text-blue-500' },
    { label: 'My Contracts', icon: FileText, path: '/dashboard/contracts', color: 'text-purple-500' },
    { label: 'Market Insights', icon: Target, path: '/dashboard/brand', color: 'text-teal-500' },
    { label: 'Competitor Track', icon: Shield, path: '/dashboard/brand', color: 'text-rose-500' },
    { label: 'Campaign Planner', icon: Sparkles, path: '/dashboard/brand', color: 'text-amber-500' },
    { label: 'ROI Tracker', icon: LineChart, path: '/dashboard/brand', color: 'text-green-500' },
    { label: 'Analytics', icon: BarChart3, path: '/dashboard/brand', color: 'text-indigo-500' },
    { label: 'Contract Editor', icon: PenTool, path: '/dashboard/editor', color: 'text-pink-500' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications', color: 'text-orange-500' },
    { label: 'Profile', icon: Settings, path: '/dashboard/profile', color: 'text-gray-500' },
  ],
  analyst: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/analyst', color: 'text-green-500' },
    { label: 'My Contracts', icon: FileText, path: '/dashboard/contracts', color: 'text-purple-500' },
    { label: 'Trend Lifecycle', icon: Activity, path: '/dashboard/analyst', color: 'text-blue-500' },
    { label: 'Advanced Charts', icon: BarChart3, path: '/dashboard/analyst', color: 'text-indigo-500' },
    { label: 'Data Export', icon: Database, path: '/dashboard/analyst', color: 'text-teal-500' },
    { label: 'Deep Insights', icon: LineChart, path: '/dashboard/analyst', color: 'text-amber-500' },
    { label: 'Pattern Detection', icon: GitBranch, path: '/dashboard/analyst', color: 'text-rose-500' },
    { label: 'Research Notes', icon: BookOpen, path: '/dashboard/analyst', color: 'text-orange-500' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications', color: 'text-orange-500' },
    { label: 'Profile', icon: Settings, path: '/dashboard/profile', color: 'text-gray-500' },
  ],
  admin: [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard/admin', color: 'text-red-500' },
    { label: 'All Contracts', icon: FileText, path: '/dashboard/contracts', color: 'text-purple-500' },
    { label: 'User Management', icon: Users, path: '/dashboard/admin', color: 'text-blue-500' },
    { label: 'Role Assignment', icon: UserCog, path: '/dashboard/admin', color: 'text-indigo-500' },
    { label: 'Blog Management', icon: BookOpen, path: '/dashboard/admin', color: 'text-teal-500' },
    { label: 'System Analytics', icon: BarChart3, path: '/dashboard/admin', color: 'text-green-500' },
    { label: 'Activity Logs', icon: Activity, path: '/dashboard/admin', color: 'text-amber-500' },
    { label: 'Moderation', icon: Shield, path: '/dashboard/admin', color: 'text-rose-500' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications', color: 'text-orange-500' },
    { label: 'Settings', icon: Settings, path: '/dashboard/profile', color: 'text-gray-500' },
  ],
};

const roleConfig: Record<string, { label: string; gradient: string; bg: string; dot: string }> = {
  creator: { label: 'Creator / Influencer', gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20', dot: 'bg-purple-500' },
  brand:   { label: 'Brand / Business',     gradient: 'from-blue-500 to-cyan-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',   dot: 'bg-blue-500' },
  analyst: { label: 'Analyst / Researcher', gradient: 'from-teal-500 to-emerald-500',bg: 'bg-teal-50 dark:bg-teal-900/20',   dot: 'bg-teal-500' },
  admin:   { label: 'System Admin',         gradient: 'from-orange-500 to-red-500',  bg: 'bg-orange-50 dark:bg-orange-900/20',dot: 'bg-orange-500' },
};

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menu = roleMenus[user.role] || roleMenus.brand;
  const cfg = roleConfig[user.role] || roleConfig.brand;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className={cn(
      'flex flex-col h-screen sticky top-0 border-r border-gray-100 dark:border-gray-800/70 transition-all duration-300 z-40 shadow-xl shadow-gray-100/50 dark:shadow-black/30',
      'bg-white dark:bg-[#0c0c14]',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800/70">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
              <span className="text-white font-black text-xs">UC</span>
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                Unique<span style={{ background: 'linear-gradient(135deg,#CF6DFC,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contracts</span>
              </span>
              <div className="text-[8px] font-semibold text-[#00C9A7] uppercase tracking-widest leading-none">AI-Powered</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
            <span className="text-white font-black text-xs">UC</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className={cn('p-1.5 rounded-lg text-gray-400 hover:text-[#CF6DFC] hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all', collapsed && 'ml-auto')}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* User card */}
      {!collapsed && (
        <div className={`mx-3 my-3 p-3 rounded-2xl ${cfg.bg} border border-gray-100 dark:border-gray-800/50`}>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name}
                className="w-10 h-10 rounded-xl border-2 border-white dark:border-gray-700 shadow-sm" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${cfg.dot} rounded-full border-2 border-white dark:border-gray-800`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
              <div className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${cfg.gradient}`}>
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                {cfg.label.split(' / ')[0]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 overflow-y-auto scrollbar-hide">
        <div className="space-y-0.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path + item.label} to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-900/25 dark:to-purple-900/10 text-[#CF6DFC]'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                )}
                title={collapsed ? item.label : undefined}>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#CF6DFC] rounded-r-full" />
                )}
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all',
                  isActive ? 'bg-[#CF6DFC]/15' : 'bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10'
                )}>
                  <Icon size={16} className={isActive ? 'text-[#CF6DFC]' : item.color} />
                </div>
                {!collapsed && (
                  <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <div className="w-2 h-2 rounded-full bg-[#CF6DFC] animate-pulse-glow shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Pro badge + logout */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800/70 space-y-2">
        {!collapsed && (
          <div className="p-3 rounded-xl border border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
            <div className="flex items-center gap-2">
              <Sparkles size={13} className="text-[#CF6DFC]" />
              <span className="text-xs font-semibold text-[#CF6DFC]">AI Features Active</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Risk detection, clause AI & smart drafting enabled.</p>
          </div>
        )}
        <button onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}>
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
            <LogOut size={15} className="text-red-500" />
          </div>
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
