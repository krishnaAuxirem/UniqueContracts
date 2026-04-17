import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, PenTool, BarChart3, Bell, Settings,
  ChevronLeft, ChevronRight, TrendingUp, Bookmark, AlertCircle,
  Users, Shield, Activity, BookOpen, Zap, Search, GitBranch,
  Target, LineChart, Database, FileBarChart, UserCog, Layers,
  MessageSquare, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  user: User;
  onLogout?: () => void;
}

const roleMenus = {
  creator: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/creator' },
    { label: 'My Contracts', icon: FileText, path: '/dashboard/contracts' },
    { label: 'Trending Topics', icon: TrendingUp, path: '/dashboard/creator#trending' },
    { label: 'Hashtag Insights', icon: Search, path: '/dashboard/creator#hashtags' },
    { label: 'AI Suggestions', icon: Zap, path: '/dashboard/creator#ai' },
    { label: 'Watchlist', icon: Bookmark, path: '/dashboard/creator#watchlist' },
    { label: 'Alerts', icon: AlertCircle, path: '/dashboard/creator#alerts' },
    { label: 'Performance', icon: BarChart3, path: '/dashboard/creator#analytics' },
    { label: 'Contract Editor', icon: PenTool, path: '/dashboard/editor' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    { label: 'Profile', icon: Settings, path: '/dashboard/profile' },
  ],
  brand: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/brand' },
    { label: 'My Contracts', icon: FileText, path: '/dashboard/contracts' },
    { label: 'Market Insights', icon: Target, path: '/dashboard/brand#insights' },
    { label: 'Competitor Track', icon: Shield, path: '/dashboard/brand#competitors' },
    { label: 'Campaign Planner', icon: Layers, path: '/dashboard/brand#campaigns' },
    { label: 'ROI Tracker', icon: LineChart, path: '/dashboard/brand#roi' },
    { label: 'Analytics', icon: BarChart3, path: '/dashboard/brand#analytics' },
    { label: 'Contract Editor', icon: PenTool, path: '/dashboard/editor' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    { label: 'Profile', icon: Settings, path: '/dashboard/profile' },
  ],
  analyst: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/analyst' },
    { label: 'My Contracts', icon: FileText, path: '/dashboard/contracts' },
    { label: 'Trend Lifecycle', icon: Activity, path: '/dashboard/analyst#lifecycle' },
    { label: 'Advanced Charts', icon: BarChart3, path: '/dashboard/analyst#charts' },
    { label: 'Data Export', icon: Database, path: '/dashboard/analyst#export' },
    { label: 'Deep Insights', icon: LineChart, path: '/dashboard/analyst#insights' },
    { label: 'Pattern Detection', icon: GitBranch, path: '/dashboard/analyst#patterns' },
    { label: 'Research Notes', icon: BookOpen, path: '/dashboard/analyst#notes' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    { label: 'Profile', icon: Settings, path: '/dashboard/profile' },
  ],
  admin: [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard/admin' },
    { label: 'All Contracts', icon: FileText, path: '/dashboard/contracts' },
    { label: 'User Management', icon: Users, path: '/dashboard/admin#users' },
    { label: 'Role Assignment', icon: UserCog, path: '/dashboard/admin#roles' },
    { label: 'Blog Management', icon: BookOpen, path: '/dashboard/admin#blog' },
    { label: 'System Analytics', icon: BarChart3, path: '/dashboard/admin#analytics' },
    { label: 'Activity Logs', icon: Activity, path: '/dashboard/admin#logs' },
    { label: 'Moderation', icon: Shield, path: '/dashboard/admin#moderation' },
    { label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    { label: 'Settings', icon: Settings, path: '/dashboard/profile' },
  ],
};

const roleLabels: Record<string, string> = {
  creator: 'Creator / Influencer',
  brand: 'Brand / Business',
  analyst: 'Analyst / Researcher',
  admin: 'System Admin',
};

const roleColors: Record<string, string> = {
  creator: 'from-purple-500 to-pink-500',
  brand: 'from-blue-500 to-cyan-500',
  analyst: 'from-green-500 to-teal-500',
  admin: 'from-orange-500 to-red-500',
};

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menu = roleMenus[user.role] || roleMenus.brand;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 z-40 shadow-sm',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">UC</span>
            </div>
            <span className="font-heading font-bold text-sm text-gray-900 dark:text-white">
              Unique<span className="text-[#CF6DFC]">Contracts</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">UC</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'p-1.5 rounded-lg text-gray-400 hover:text-[#CF6DFC] hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors',
            collapsed && 'ml-auto'
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-10 h-10 rounded-xl border-2 border-purple-100 dark:border-purple-800"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
              <div className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r mt-0.5', roleColors[user.role])}>
                {roleLabels[user.role]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto scrollbar-hide">
        {menu.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path.includes('#') && location.pathname === item.path.split('#')[0]);
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 group',
                isActive
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={18}
                className={cn(
                  'shrink-0 transition-transform group-hover:scale-110',
                  isActive ? 'text-[#CF6DFC]' : ''
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#CF6DFC]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
