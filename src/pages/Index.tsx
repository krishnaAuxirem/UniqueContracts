import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Play, CheckCircle, Star, Shield, Zap, Users, TrendingUp,
  FileText, PenTool, BarChart3, Globe, Award, ChevronLeft, ChevronRight,
  Quote, Brain, Workflow, Search, Bell
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';
import { PRICING_PLANS, FEATURE_LIST } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import heroImg from '@/assets/hero-dark-1.jpg';
import heroSlide2 from '@/assets/hero-dark-2.jpg';
import heroSlide3 from '@/assets/hero-dark-3.jpg';
import heroSlide4 from '@/assets/hero-dark-4.jpg';

const HERO_SLIDES = [
  {
    image: heroImg,
    badge: 'AI-Powered Contract Management',
    title: 'Contracts That',
    highlight: 'Work For You',
    subtitle: 'Create, sign, and manage contracts 10x faster with AI intelligence. From drafting to execution — all in one seamless platform.',
  },
  {
    image: heroSlide2,
    badge: 'Real-Time Analytics',
    title: 'Insights That',
    highlight: 'Drive Decisions',
    subtitle: 'Deep analytics on contract performance, risk scores, and ROI tracking across your entire portfolio.',
  },
  {
    image: heroSlide3,
    badge: 'Secure E-Signatures',
    title: 'Sign Deals',
    highlight: 'Digitally & Legally',
    subtitle: 'Multi-party e-signatures with full audit trails, compliance tracking, and instant delivery notifications.',
  },
  {
    image: heroSlide4,
    badge: 'Workflow Automation',
    title: 'Automate Your',
    highlight: 'Approval Flows',
    subtitle: 'Multi-level approval workflows that route contracts to the right stakeholders automatically.',
  },
];

const STATS = [
  { value: '50K+', label: 'Contracts Managed' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '10x', label: 'Faster Signing' },
  { value: '₹500Cr+', label: 'Deals Facilitated' },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Krishnan',
    role: 'VP Legal, Growfast Ventures',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    text: 'UniqueContracts has transformed how we handle agreements. What used to take days now happens in hours. The AI risk detection saved us from two potentially damaging clauses.',
    rating: 5,
    company: 'Growfast Ventures',
  },
  {
    name: 'Rohit Bansal',
    role: 'Founder, ContentFirst Studio',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit',
    text: 'As a content creator managing 20+ brand deals, this platform is a lifesaver. The influencer contract templates are spot-on and the e-signature flow is seamless.',
    rating: 5,
    company: 'ContentFirst Studio',
  },
  {
    name: 'Dr. Priya Nambiar',
    role: 'Chief Legal Officer, MedTech India',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya2',
    text: 'The compliance features and audit trails are exceptional. Our legal team reduced contract review time by 65% within the first month of using UniqueContracts.',
    rating: 5,
    company: 'MedTech India',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: FileText,
    title: 'Create or Upload',
    description: 'Start from a template or upload existing documents. AI auto-fills placeholders and suggests relevant clauses.',
    color: 'from-purple-500 to-violet-600',
  },
  {
    step: '02',
    icon: Workflow,
    title: 'Review & Approve',
    description: 'Route contracts through approval workflows. Collaborate with comments, track changes, and compare versions.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    step: '03',
    icon: PenTool,
    title: 'Sign Digitally',
    description: 'All parties sign securely with e-signatures. Full audit trail maintained for legal compliance.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    step: '04',
    icon: BarChart3,
    title: 'Track & Analyze',
    description: 'Monitor contract performance, expiry alerts, and portfolio analytics from a single dashboard.',
    color: 'from-orange-500 to-amber-600',
  },
];

const INTEGRATIONS = [
  'Google Workspace', 'Microsoft 365', 'Salesforce', 'HubSpot', 'Slack', 'Zapier', 'DocuSign', 'Zoho CRM',
];

const TRUSTED_BY = [
  'TechNova', 'GrowFast', 'BrandEdge', 'LegalFirst', 'DataVault', 'StyleCo', 'MedTech India', 'FreshBrew',
];

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
      }, 4500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 8000);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />

      {/* ══════════════════════════════════════
           HERO SECTION — Full-Width Dark Cinematic
         ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* ── Background Image (full-bleed) ── */}
        <img
          key={currentSlide}
          src={slide.image}
          alt="Hero visual"
          className="absolute inset-0 w-full h-full object-cover hero-slider"
        />

        {/* ── Dark Shade Overlay (multi-layer for depth) ── */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(5,0,20,0.88) 0%, rgba(15,5,40,0.82) 40%, rgba(30,10,60,0.70) 70%, rgba(10,0,30,0.80) 100%)' }} />
        {/* Radial glow from center-left */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(207,109,252,0.18) 0%, transparent 70%)' }} />
        {/* Bottom vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,0,20,0.60) 0%, transparent 50%)' }} />
        {/* Top vignette */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,0,20,0.40) 0%, transparent 30%)' }} />

        {/* ── Floating ambient orbs ── */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#CF6DFC]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C1BFFF]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-700/10 rounded-full blur-2xl pointer-events-none" />

        {/* ── Main Content ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-20 flex flex-col lg:flex-row items-center gap-16">

          {/* Left — Text Content */}
          <div className="flex-1 max-w-2xl">

            {/* Live Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border border-purple-400/30 bg-white/5 backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#CF6DFC] rounded-full animate-pulse shadow-[0_0_8px_#CF6DFC]" />
              <span className="text-sm font-semibold text-purple-200 tracking-wide">{slide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-heading font-extrabold text-white mb-6 leading-[1.08] tracking-tight">
              {slide.title}
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #CF6DFC 0%, #C1BFFF 50%, #BDB96A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {slide.highlight}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button
                onClick={() => navigate('/register')}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base shadow-2xl transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] hover:shadow-purple-500/40"
                style={{ background: 'linear-gradient(135deg, #CF6DFC 0%, #9B4FD0 100%)', boxShadow: '0 8px 32px rgba(207,109,252,0.35)' }}
              >
                Start Free Trial
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigate('/features')}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-base rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className="w-7 h-7 bg-[#CF6DFC] rounded-full flex items-center justify-center">
                  <Play size={12} fill="white" className="text-white ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6">
              {[
                { icon: Shield, text: 'IT Act Compliant' },
                { icon: Award, text: 'SOC 2 Certified' },
                { icon: Globe, text: '10+ Countries' },
                { icon: Users, text: '10K+ Businesses' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={14} className="text-[#CF6DFC]" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Floating Stats Cards */}
          <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
            {/* Main stat card */}
            <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #CF6DFC, #9B4FD0)' }}>
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Platform Stats</p>
                  <p className="text-sm font-bold text-white">Live Dashboard</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400">Live</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: '50K+', label: 'Contracts' },
                  { val: '10x', label: 'Faster' },
                  { val: '98%', label: 'Satisfaction' },
                  { val: '₹500Cr+', label: 'Deals' },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-2xl p-3 text-center">
                    <div className="text-xl font-extrabold font-heading" style={{ background: 'linear-gradient(135deg,#CF6DFC,#C1BFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant card */}
            <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
                  <Brain size={15} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">AI Risk Check</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                  <CheckCircle size={12} className="text-green-400" />
                  <span className="text-xs text-green-300">Payment terms: Clear</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  <Bell size={12} className="text-amber-400" />
                  <span className="text-xs text-amber-300">Add Force Majeure clause</span>
                </div>
                <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2">
                  <Zap size={12} className="text-[#CF6DFC]" />
                  <span className="text-xs text-purple-300">3 optimizations ready</span>
                </div>
              </div>
            </div>

            {/* Recent Activity card */}
            <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-5 shadow-2xl">
              <p className="text-xs text-gray-400 font-medium mb-3">Recent Activity</p>
              <div className="space-y-2.5">
                {[
                  { action: 'NDA Signed', time: '2m ago', color: 'bg-green-400' },
                  { action: 'Contract Drafted', time: '15m ago', color: 'bg-purple-400' },
                  { action: 'Approval Sent', time: '1h ago', color: 'bg-blue-400' },
                ].map(item => (
                  <div key={item.action} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                    <span className="text-xs text-gray-300 flex-1">{item.action}</span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Slide Controls — bottom center ── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`rounded-full transition-all duration-400 ${idx === currentSlide ? 'w-8 h-2.5 bg-[#CF6DFC] shadow-[0_0_10px_#CF6DFC]' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
            <button
              onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-md rounded-full border border-white/15">
            <div className="w-1.5 h-1.5 bg-[#CF6DFC] rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-300">{currentSlide + 1} / {HERO_SLIDES.length} — {slide.badge}</span>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-heading font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section className="py-12 bg-[#FDFBD4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mb-8 font-medium uppercase tracking-wider">
            Trusted by leading companies across India
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {TRUSTED_BY.map(brand => (
              <div key={brand} className="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-[#CF6DFC] hover:text-[#CF6DFC] transition-colors cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC] text-sm font-semibold rounded-full">
              Why UniqueContracts
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mt-4 mb-5">
              Everything you need to manage<br className="hidden md:block" />
              <span className="gradient-text"> contracts intelligently</span>
            </h2>
            <p className="text-lg text-[#4B5563] dark:text-gray-400 max-w-2xl mx-auto">
              From AI-powered drafting to secure signatures, UniqueContracts is the complete contract lifecycle platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_LIST.map(feature => (
              <div key={feature.title} className="group glass-card rounded-2xl p-6 hover-lift cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-lg">✦</span>
                </div>
                <h3 className="text-lg font-heading font-semibold text-[#111827] dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#4B5563] dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-[#FDFBD4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC] text-sm font-semibold rounded-full">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mt-4 mb-4">
              How <span className="gradient-text">UniqueContracts</span> works
            </h2>
            <p className="text-lg text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto">
              Go from contract idea to fully executed agreement in four simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#CF6DFC]/30 to-transparent z-0" />
                  )}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover-lift relative z-10">
                    <div className="text-xs font-bold text-[#CF6DFC] mb-3 tracking-widest">{step.step}</div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-heading font-semibold text-[#111827] dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-[#4B5563] dark:text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI Features Highlight ── */}
      <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC] text-sm font-semibold rounded-full inline-block mb-6">
                AI Intelligence
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-6">
                AI that understands<br />
                <span className="gradient-text">your contracts</span>
              </h2>
              <p className="text-lg text-[#4B5563] dark:text-gray-400 mb-8 leading-relaxed">
                Our AI engine reads, analyzes, and improves your contracts automatically — spotting risks, suggesting clauses, and drafting content in seconds.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { icon: Brain, title: 'Smart Drafting', desc: 'Generate contract content from a brief description using GPT-level AI.' },
                  { icon: Shield, title: 'Risk Detection', desc: 'Automatically flag risky clauses with severity scores and explanations.' },
                  { icon: Zap, title: 'Clause Recommendations', desc: 'AI suggests missing clauses based on contract type and jurisdiction.' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#111827] dark:text-white text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-[#4B5563] dark:text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to="/features" className="inline-flex items-center gap-2 text-[#CF6DFC] font-semibold hover:gap-3 transition-all">
                Explore AI Features <ArrowRight size={16} />
              </Link>
            </div>

            {/* AI Demo Card */}
            <div className="relative">
              <div className="glass-card rounded-3xl p-6 shadow-2xl border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <Brain size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-white">AI Contract Assistant</p>
                    <p className="text-xs text-gray-400">Analyzing your document...</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-500">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={13} className="text-green-500" />
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400">Low Risk Detected</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment terms are clearly defined with specific due dates.</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={13} className="text-yellow-500" />
                      <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">Suggestion</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add Force Majeure clause for protection against unforeseen events.</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={13} className="text-[#CF6DFC]" />
                      <span className="text-xs font-semibold text-[#CF6DFC]">AI Drafted Clause</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">"Either party may terminate this agreement upon 30 days written notice..."</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <span className="text-xs text-[#CF6DFC] font-bold">3</span>
                    </div>
                    <span className="text-xs text-gray-500">suggestions ready</span>
                  </div>
                  <button className="text-xs font-semibold text-[#CF6DFC] hover:underline">Apply All →</button>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#C1BFFF]/20 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#CF6DFC]/15 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-[#FDFBD4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC] text-sm font-semibold rounded-full">
              Customer Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mt-4">
              Loved by <span className="gradient-text">legal teams</span> everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover-lift ${i === 1 ? 'md:-mt-4 border-[#CF6DFC]/30 shadow-lg shadow-purple-100 dark:shadow-purple-900/20' : ''}`}>
                <Quote size={24} className="text-[#CF6DFC] mb-4 opacity-60" />
                <p className="text-[#4B5563] dark:text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-purple-100" />
                  <div>
                    <p className="font-semibold text-sm text-[#111827] dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Preview ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="px-4 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC] text-sm font-semibold rounded-full">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mt-4 mb-4">
              Simple, transparent pricing
            </h2>
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-[#CF6DFC] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'bg-[#CF6DFC] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                Yearly <span className="ml-1 text-xs text-green-500 font-semibold">Save 17%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map(plan => (
              <div key={plan.id} className={`relative rounded-2xl p-6 border ${plan.popular ? 'border-[#CF6DFC] shadow-xl shadow-purple-100 dark:shadow-purple-900/20 gradient-primary text-white' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-white text-xs font-bold rounded-full shadow">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`font-heading font-bold text-xl mb-1 ${plan.popular ? 'text-white' : 'text-[#111827] dark:text-white'}`}>{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.popular ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>{plan.description}</p>
                  <div className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-[#CF6DFC]'}`}>
                    {plan.currency}{(billingCycle === 'yearly' ? Math.floor(plan.yearlyPrice / 12) : plan.price).toLocaleString('en-IN')}
                    <span className={`text-base font-normal ${plan.popular ? 'text-purple-200' : 'text-gray-400'}`}>/mo</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.slice(0, 6).map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      <CheckCircle size={14} className={`mt-0.5 shrink-0 ${plan.popular ? 'text-white' : 'text-[#CF6DFC]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? 'bg-white text-[#CF6DFC] hover:bg-purple-50' : 'gradient-primary text-white hover:opacity-90'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="text-[#CF6DFC] font-semibold hover:underline inline-flex items-center gap-1">
              Compare all features <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Integrations ── */}
      <section className="py-16 bg-[#FDFBD4] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-heading font-bold text-[#111827] dark:text-white mb-3">
            Integrates with your favorite tools
          </h3>
          <p className="text-[#4B5563] dark:text-gray-400 mb-8">Connect UniqueContracts with tools your team already loves.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map(tool => (
              <div key={tool} className="px-5 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-[#CF6DFC] hover:text-[#CF6DFC] transition-colors cursor-default shadow-sm">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-5">
            Ready to transform your<br />contract management?
          </h2>
          <p className="text-lg text-purple-100 mb-10 max-w-xl mx-auto">
            Join 10,000+ businesses that trust UniqueContracts to manage their most important agreements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-[#CF6DFC] font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-lg text-base">
              Start Free 14-Day Trial
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-base">
              Schedule a Demo
            </Link>
          </div>
          <p className="mt-6 text-purple-200 text-sm">No credit card required · Cancel anytime · SOC 2 compliant</p>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
