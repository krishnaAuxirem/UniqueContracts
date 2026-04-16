import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Chrome, ArrowRight, CheckCircle } from 'lucide-react';
import { register, loginWithGoogle } from '@/lib/auth';
import type { UserRole } from '@/types';
import { toast } from 'sonner';

const ROLES: { value: UserRole; label: string; desc: string; color: string }[] = [
  { value: 'creator', label: 'Creator / Influencer', desc: 'Manage brand deals & collabs', color: 'from-purple-500 to-pink-500' },
  { value: 'brand', label: 'Brand / Business', desc: 'Manage vendor & partner contracts', color: 'from-blue-500 to-cyan-500' },
  { value: 'analyst', label: 'Analyst / Researcher', desc: 'Research and analyze contracts', color: 'from-green-500 to-teal-500' },
  { value: 'admin', label: 'Admin', desc: 'Full system control', color: 'from-orange-500 to-red-500' },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [role, setRole] = useState<UserRole>('brand');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getDashPath = (r: string) => {
    const paths: Record<string, string> = {
      creator: '/dashboard/creator',
      brand: '/dashboard/brand',
      analyst: '/dashboard/analyst',
      admin: '/dashboard/admin',
    };
    return paths[r] || '/dashboard/brand';
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) { toast.error('Please fill name and email'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPass) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => {
      try {
        const user = register(name, email, password, role, company);
        toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}!`);
        navigate(getDashPath(role));
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      const user = loginWithGoogle(role);
      toast.success('Registered with Google!');
      navigate(getDashPath(user.role));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBD4] dark:bg-gray-950">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 gradient-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 text-white max-w-sm">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-sm">UC</span>
            </div>
            <span className="font-heading font-bold text-xl">UniqueContracts</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold mb-4 leading-tight">
            Join 10,000+ teams managing contracts smarter
          </h1>
          <p className="text-purple-100 mb-10">Start your free 14-day trial. No credit card required.</p>
          <div className="space-y-3">
            {[
              '14-day free trial, no card needed',
              'AI contract drafting included',
              'Unlimited templates access',
              'Priority support from day 1',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <CheckCircle size={15} className="text-white opacity-80 shrink-0" />
                <span className="text-purple-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">UC</span>
            </div>
            <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">UniqueContracts</span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map(s => (
                <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-[#CF6DFC]' : 'bg-gray-200 dark:bg-gray-600'}`} />
              ))}
            </div>

            <h2 className="text-2xl font-heading font-extrabold text-[#111827] dark:text-white mb-1">
              {step === 1 ? 'Create your account' : 'Choose your role & set password'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {step === 1 ? (
                <>Already have an account? <Link to="/login" className="text-[#CF6DFC] font-semibold hover:underline">Sign in</Link></>
              ) : 'Tell us how you plan to use UniqueContracts'}
            </p>

            {step === 1 && (
              <>
                <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-5">
                  <Chrome size={18} className="text-blue-500" />
                  Continue with Google
                </button>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                  <span className="text-xs text-gray-400">or with email</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                </div>
                <form onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Priya Sharma" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company (optional)</label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company name" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                  </div>
                  <button type="submit" className="w-full py-3.5 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-lg">
                    Continue <ArrowRight size={16} />
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Your Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${role === r.value ? 'border-[#CF6DFC] bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}
                      >
                        <div className="text-xs font-semibold text-gray-800 dark:text-white mb-0.5">{r.label.split('/')[0].trim()}</div>
                        <div className="text-xs text-gray-400">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Create Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full px-4 py-3 pr-11 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                  <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter password" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                </div>
                <p className="text-xs text-gray-400">
                  By registering, you agree to our{' '}
                  <Link to="/terms" className="text-[#CF6DFC] hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#CF6DFC] hover:underline">Privacy Policy</Link>.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-lg">
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
