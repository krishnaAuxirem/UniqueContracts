import { useState } from 'react';
import { Camera, Save, Shield, Bell, Moon, Sun } from 'lucide-react';
import { getCurrentUser, updateProfile } from '@/lib/auth';
import { useDarkMode } from '@/hooks/useDarkMode';
import { toast } from 'sonner';

export default function Profile() {
  const user = getCurrentUser();
  const { isDark, toggle } = useDarkMode();
  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name, company });
      setSaving(false);
      toast.success('Profile updated successfully');
    }, 600);
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Profile Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-20 h-20 rounded-2xl border-4 border-purple-100 dark:border-purple-800" />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 gradient-primary rounded-full flex items-center justify-center shadow-md hover:opacity-90">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] rounded-full capitalize font-medium">{user.role}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${user.plan === 'enterprise' ? 'bg-amber-100 text-amber-600' : user.plan === 'pro' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{user.plan} plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-5">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input value={user.email} disabled className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company name" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
            <input value={user.role} disabled className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-400 cursor-not-allowed capitalize" />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="mt-5 flex items-center gap-2 px-6 py-2.5 gradient-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shadow-md">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
          Save Changes
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-5">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={16} className="text-[#CF6DFC]" /> : <Sun size={16} className="text-amber-500" />}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                <p className="text-xs text-gray-400">Switch between light and dark theme</p>
              </div>
            </div>
            <button onClick={toggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-[#CF6DFC]' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-[#CF6DFC]" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                <p className="text-xs text-gray-400">Receive email alerts for contract events</p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#CF6DFC]">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-[#CF6DFC]" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400">Extra security for your account</p>
              </div>
            </div>
            <button className="text-xs text-[#CF6DFC] font-semibold hover:underline">Enable →</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-800">
        <h3 className="font-heading font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">Permanently delete your account and all associated data.</p>
        <button className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">Delete Account</button>
      </div>
    </div>
  );
}
