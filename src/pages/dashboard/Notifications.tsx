import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, AlertCircle, CheckCircle, MessageSquare, Settings, Trash2, CheckCheck } from 'lucide-react';
import { getNotifications } from '@/lib/mockData';
import { timeAgo } from '@/lib/utils';
import type { Notification } from '@/types';

const typeIcons: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  approval_needed: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  expiry_alert: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  contract_signed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
  comment: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  system: { icon: Settings, color: 'text-[#CF6DFC]', bg: 'bg-purple-50 dark:bg-purple-900/20' },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const remove = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const shown = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{unreadCount} unread notifications</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-[#CF6DFC] font-medium hover:underline">
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'unread'].map(f => (
          <button key={f} onClick={() => setFilter(f as 'all' | 'unread')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filter === f ? 'gradient-primary text-white shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#CF6DFC]'}`}>
            {f} {f === 'unread' && unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-white/30 rounded-full text-xs">{unreadCount}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={40} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400">No notifications</p>
          </div>
        ) : shown.map(n => {
          const typeConfig = typeIcons[n.type] || typeIcons.system;
          const Icon = typeConfig.icon;
          return (
            <div key={n.id} onClick={() => { markRead(n.id); if (n.contractId) navigate(`/dashboard/editor/${n.contractId}`); }}
              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:border-[#CF6DFC]/30 hover:shadow-sm ${n.read ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' : 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/50'}`}>
              <div className={`w-10 h-10 rounded-xl ${typeConfig.bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={typeConfig.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-semibold ${n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>{n.title}</p>
                  {!n.read && <div className="w-2 h-2 bg-[#CF6DFC] rounded-full" />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); remove(n.id); }} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
