import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, ChevronDown, LogOut, User as UserIcon, Settings, Sparkles } from 'lucide-react';
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

  useEffect(() => { setUser(getCurrentUser()); }, [location.pathname]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); setUser(null); setProfileOpen(false); navigate('/'); };
  const getDashboardPath = (role: string) => ({ creator: '/dashboard/creator', brand: '/dashboard/brand', analyst: '/dashboard/analyst', admin: '/dashboard/admin' })[role] || '/dashboard/brand';

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
      scrolled
        ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-lg shadow-purple-100/20 dark:shadow-purple-900/10 border-b border-purple-100/60 dark:border-purple-900/20'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-purple-300/40 group-hover:shadow-purple-400/60 transition-shadow">
              <span className="text-white font-black text-sm tracking-tight">UC</span>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#00C9A7] rounded-full border-2 border-white dark:border-gray-950 animate-pulse" />
            </div>
            <div>
              <span className="font-heading font-800 text-lg text-[#111827] dark:text-white leading-none">
                Unique<span style={{ background: 'linear-gradient(135deg,#CF6DFC,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contracts</span>
              </span>
              <div className="text-[9px] font-semibold text-[#00C9A7] uppercase tracking-widest leading-none">AI-Powered CLM</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path}
                className={cn(
                  'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group',
                  location.pathname === link.path
                    ? 'text-[#CF6DFC] bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-[#CF6DFC] hover:bg-purple-50/70 dark:hover:bg-purple-900/15'
                )}>
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#CF6DFC] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggle}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-xl border border-purple-200/60 dark:border-purple-800/60 hover:border-[#CF6DFC] transition-all bg-white dark:bg-gray-900 shadow-sm">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-7 h-7 rounded-lg border border-purple-100 dark:border-purple-800" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={13} className={cn('text-gray-400 transition-transform', profileOpen && 'rotate-180')} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl shadow-purple-100/30 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-1">
                      <p className="font-bold text-sm text-gray-800 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize"
                        style={{ background: 'linear-gradient(135deg,#CF6DFC22,#C1BFFF22)', color: '#CF6DFC', border: '1px solid #CF6DFC44' }}>
                        {user.role}
                      </span>
                    </div>
                    {[
                      { icon: UserIcon, label: 'Dashboard', action: () => { navigate(getDashboardPath(user.role)); setProfileOpen(false); } },
                      { icon: Settings, label: 'Profile Settings', action: () => { navigate('/dashboard/profile'); setProfileOpen(false); } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-[#CF6DFC] transition-colors">
                        <item.icon size={15} /> {item.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-xl">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#CF6DFC] transition-colors">
                  Login
                </Link>
                <Link to="/register"
                  className="group flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-purple-300/40 hover:shadow-purple-400/60 hover:scale-[1.03] active:scale-[0.97] transition-all"
                  style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
                  <Sparkles size={14} />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} className="p-2 text-gray-500 dark:text-gray-400">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 py-4 px-4 shadow-2xl animate-slide-up">
          {NAV_LINKS.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-colors',
                location.pathname === link.path
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}>
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            {user ? (
              <>
                <button onClick={() => { navigate(getDashboardPath(user.role)); setIsOpen(false); }}
                  className="w-full px-4 py-3 text-center text-sm font-semibold text-[#CF6DFC] border-2 border-[#CF6DFC]/30 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                  Go to Dashboard
                </button>
                <button onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full px-4 py-3 text-center text-sm font-medium text-red-500 border border-red-200 dark:border-red-800 rounded-xl">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center text-sm font-bold text-white rounded-xl"
                  style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
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
