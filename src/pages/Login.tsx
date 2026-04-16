import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Chrome, ArrowRight, Shield } from 'lucide-react';
import { login, loginWithGoogle } from '@/lib/auth';
import { DEMO_CREDENTIALS } from '@/constants';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getDashPath = (role: string) => {
    const paths: Record<string, string> = {
      creator: '/dashboard/creator',
      brand: '/dashboard/brand',
      analyst: '/dashboard/analyst',
      admin: '/dashboard/admin',
    };
    return paths[role] || '/dashboard/brand';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        const user = login(email, password);
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
        navigate(getDashPath(user.role));
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Login failed');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      const user = loginWithGoogle();
      toast.success('Logged in with Google');
      navigate(getDashPath(user.role));
      setLoading(false);
    }, 1000);
  };

  const useDemo = (email: string) => {
    setEmail(email);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBD4] dark:bg-gray-950">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.15),transparent)]" />
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">UC</span>
            </div>
            <span className="font-heading font-bold text-xl">UniqueContracts</span>
          </div>
          <h1 className="text-4xl font-heading font-extrabold mb-4 leading-tight">
            Welcome back to smarter contract management
          </h1>
          <p className="text-purple-100 text-lg mb-10">
            Your contracts are waiting. Sign in to continue managing deals with AI precision.
          </p>
          <div className="space-y-4">
            {[
              'AI-powered contract drafting',
              'Multi-party e-signatures',
              'Real-time approval workflows',
              'Enterprise-grade security',
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield size={12} className="text-white" />
                </div>
                <span className="text-purple-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">UC</span>
            </div>
            <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">UniqueContracts</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-heading font-extrabold text-[#111827] dark:text-white mb-1">Sign in</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#CF6DFC] font-semibold hover:underline">Register here</Link>
            </p>

            {/* Google Login */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6"
            >
              <Chrome size={18} className="text-blue-500" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              <span className="text-xs text-gray-400">or sign in with email</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white placeholder-gray-400"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <button type="button" className="text-xs text-[#CF6DFC] hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white placeholder-gray-400"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">Quick Demo Access (password: demo123)</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_CREDENTIALS.map(cred => (
                  <button
                    key={cred.email}
                    onClick={() => useDemo(cred.email)}
                    className="px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 hover:border-[#CF6DFC] text-gray-600 dark:text-gray-400 hover:text-[#CF6DFC] rounded-lg transition-colors text-left"
                  >
                    <div className="font-semibold truncate">{cred.role.split('/')[0].trim()}</div>
                    <div className="text-gray-400 truncate">{cred.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
