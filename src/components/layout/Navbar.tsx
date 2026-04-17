import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, ChevronDown, Bell, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { getCurrentUser, logout } from '@/lib/auth';
import { NAV_LINKS } from '@/constants';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setProfileOpen(false);
    navigate('/');
  };

  const getDashboardPath = (role: string) => {
    const paths: Record<string, string> = {
      creator: '/dashboard/creator',
      brand: '/dashboard/brand',
      analyst: '/dashboard/analyst',
      admin: '/dashboard/admin',
    };
    return paths[role] || '/dashboard/brand';
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-purple-100 dark:border-purple-900/30'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md group-hover:shadow-purple-300 transition-shadow">
              <span className="text-white font-bold text-sm">UC</span>
            </div>
            <span className="font-heading font-700 text-lg text-brand-heading dark:text-white">
              Unique<span className="text-[#CF6DFC]">Contracts</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === link.path
                    ? 'text-[#CF6DFC] bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-[#CF6DFC] hover:bg-purple-50 dark:hover:bg-purple-900/20'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 hover:border-[#CF6DFC] transition-colors bg-white dark:bg-gray-800"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] rounded-full capitalize">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => { navigate(getDashboardPath(user.role)); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserIcon size={15} /> Dashboard
                    </button>
                    <button
                      onClick={() => { navigate('/dashboard/profile'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings size={15} /> Profile Settings
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#CF6DFC] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white gradient-primary rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-purple-300"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} className="p-2 text-gray-500">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-4 px-4 shadow-xl">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors',
                location.pathname === link.path
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => { navigate(getDashboardPath(user.role)); setIsOpen(false); }}
                  className="w-full px-4 py-3 text-center text-sm font-medium text-[#CF6DFC] border border-[#CF6DFC] rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full px-4 py-3 text-center text-sm font-medium text-red-600 border border-red-200 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-center text-sm font-semibold text-white gradient-primary rounded-lg">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
