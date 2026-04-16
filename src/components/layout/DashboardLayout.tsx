import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import type { User } from '@/types';
import { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { getNotifications } from '@/lib/mockData';

export default function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CF6DFC] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts, templates..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#CF6DFC] text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/notifications')}
              className="relative p-2 text-gray-500 hover:text-[#CF6DFC] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#CF6DFC] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/dashboard/profile')}
              className="flex items-center gap-2"
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-lg border-2 border-purple-100 dark:border-purple-800"
              />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
