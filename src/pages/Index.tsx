import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Play, CheckCircle, Star, Shield, Zap, Users, TrendingUp,
  FileText, PenTool, BarChart3, Globe, Award, ChevronLeft, ChevronRight,
  Quote, Brain, Workflow, Bell, Sparkles, Lock, Clock, Target, Layers,
  GitBranch, Database, Activity, Check, X
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';
import { PRICING_PLANS, FEATURE_LIST } from '@/constants';
import heroImg from '@/assets/hero-dark-1.jpg';
import heroSlide2 from '@/assets/hero-dark-2.jpg';
import heroSlide3 from '@/assets/hero-dark-3.jpg';
import heroSlide4 from '@/assets/hero-dark-4.jpg';

const HERO_SLIDES = [
  { image: heroImg, badge: 'AI-Powered Contract Management', title: 'Contracts That', highlight: 'Work For You', subtitle: 'Create, sign, and manage contracts 10x faster with AI intelligence. From drafting to execution — all in one seamless platform.', accentColor: '#CF6DFC' },
  { image: heroSlide2, badge: 'Real-Time Analytics Dashboard', title: 'Insights That', highlight: 'Drive Decisions', subtitle: 'Deep analytics on contract performance, risk scores, and ROI tracking across your entire portfolio.', accentColor: '#00C9A7' },
  { image: heroSlide3, badge: 'Secure E-Signature System', title: 'Sign Deals', highlight: 'Digitally & Legally', subtitle: 'Multi-party e-signatures with full audit trails, compliance tracking, and instant delivery notifications.', accentColor: '#FF6B6B' },
  { image: heroSlide4, badge: 'Workflow Automation Engine', title: 'Automate Your', highlight: 'Approval Flows', subtitle: 'Multi-level approval workflows that route contracts to the right stakeholders automatically.', accentColor: '#FFBA08' },
];

const TICKER_ITEMS = [
  '⚡ AI Contract Drafting', '🔐 Bank-Grade Security', '✍️ E-Signatures in 60s', '📊 Real-Time Analytics',
  '🤖 Risk Detection AI', '🔄 Version Control', '🌐 Multi-Party Signing', '📋 500+ Templates',
  '🚀 10x Faster Workflows', '🛡️ SOC 2 Certified', '📱 Mobile-First Design', '🔗 CRM Integrations',
];

const STATS = [
  { value: '50K+', label: 'Contracts Managed', color: 'text-[#CF6DFC]', bg: 'bg-purple-50 dark:bg-purple-900/15' },
  { value: '98%', label: 'Customer Satisfaction', color: 'text-[#00C9A7]', bg: 'bg-teal-50 dark:bg-teal-900/15' },
  { value: '10x', label: 'Faster Signing', color: 'text-[#FF6B6B]', bg: 'bg-red-50 dark:bg-red-900/15' },
  { value: '₹500Cr+', label: 'Deals Facilitated', color: 'text-[#FFBA08]', bg: 'bg-amber-50 dark:bg-amber-900/15' },
];

const FEATURES_TABS = [
  {
    id: 'ai', label: 'AI Drafting', icon: Brain, color: '#CF6DFC',
    features: ['Generate contracts from plain-English briefs', 'AI clause recommendations by contract type', 'Risk detection with severity scores', 'Smart negotiation suggestions'],
    highlight: 'Reduce drafting time by 80%',
  },
  {
    id: 'sign', label: 'E-Signatures', icon: PenTool, color: '#FF6B6B',
    features: ['Typed, drawn & digital certificates', 'Sequential & parallel signing flows', 'Mobile-optimised signing experience', 'IT Act 2000 legal compliance'],
    highlight: 'Sign anywhere in under 60 seconds',
  },
  {
    id: 'analytics', label: 'Analytics', icon: BarChart3, color: '#00C9A7',
    features: ['Real-time contract status tracking', 'Risk score radar across portfolio', 'Approval timeline benchmarking', 'CSV / PDF report export'],
    highlight: 'Full portfolio visibility, always',
  },
  {
    id: 'workflow', label: 'Automation', icon: Workflow, color: '#FFBA08',
    features: ['Multi-level approval chains', 'Sequential & parallel routing', 'Conditional logic & auto-escalation', 'Smart expiry & renewal alerts'],
    highlight: 'Zero manual chasing, ever',
  },
];

const TESTIMONIALS = [
  { name: 'Ananya Krishnan', role: 'VP Legal, Growfast Ventures', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya', text: 'UniqueContracts has transformed how we handle agreements. What used to take days now happens in hours. The AI risk detection saved us from two potentially damaging clauses.', rating: 5, metric: '65% faster', metricLabel: 'contract review' },
  { name: 'Rohit Bansal', role: 'Founder, ContentFirst Studio', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit', text: 'As a content creator managing 20+ brand deals, this platform is a lifesaver. The influencer contract templates are spot-on and the e-signature flow is seamless.', rating: 5, metric: '20+ deals', metricLabel: 'managed monthly' },
  { name: 'Dr. Priya Nambiar', role: 'CLO, MedTech India', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya2', text: 'The compliance features and audit trails are exceptional. Our legal team reduced contract review time by 65% within the first month of using UniqueContracts.', rating: 5, metric: '₹12Cr+', metricLabel: 'contracts secured' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: FileText, title: 'Create or Upload', description: 'Start from a template or upload existing documents. AI auto-fills placeholders and suggests clauses.', color: 'from-[#CF6DFC] to-[#9B4FD0]', glow: 'rgba(207,109,252,0.3)' },
  { step: '02', icon: Workflow, title: 'Review & Approve', description: 'Route contracts through workflows, collaborate with comments, track changes, and compare versions.', color: 'from-[#6366F1] to-[#4F46E5]', glow: 'rgba(99,102,241,0.3)' },
  { step: '03', icon: PenTool, title: 'Sign Digitally', description: 'All parties sign securely with e-signatures. Full audit trail maintained for legal compliance.', color: 'from-[#FF6B6B] to-[#F43F5E]', glow: 'rgba(255,107,107,0.3)' },
  { step: '04', icon: BarChart3, title: 'Track & Analyze', description: 'Monitor contract performance, expiry alerts, and portfolio analytics from a single dashboard.', color: 'from-[#00C9A7] to-[#0EA5E9]', glow: 'rgba(0,201,167,0.3)' },
];

const COMPARISON = {
  features: ['Contract Creation', 'AI Risk Analysis', 'E-Signatures', 'Version Control', 'Approval Workflows', 'Analytics Dashboard', 'Indian Law Compliance', 'Multi-Party Signing', 'Real-Time Collaboration', 'Mobile App'],
  competitors: { 'Traditional': [true,false,false,false,false,false,false,false,false,false], 'Others': [true,false,true,true,false,true,false,true,false,false], 'UniqueContracts': [true,true,true,true,true,true,true,true,true,true] },
};

const INTEGRATIONS = ['Google Workspace', 'Microsoft 365', 'Salesforce', 'HubSpot', 'Slack', 'Zapier', 'Zoho CRM', 'Tally ERP', 'QuickBooks', 'DocuSign', 'AWS S3', 'Google Drive'];

const TRUSTED_BY = ['TechNova', 'GrowFast', 'BrandEdge', 'LegalFirst', 'DataVault', 'StyleCo', 'MedTech India', 'FreshBrew'];

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length), 4800);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 9000);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-[#080510]">
      <Navbar />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img key={currentSlide} src={slide.image} alt="Hero" className="absolute inset-0 w-full h-full object-cover hero-slider" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(5,0,20,0.90) 0%,rgba(10,3,30,0.85) 35%,rgba(20,8,50,0.75) 65%,rgba(8,0,25,0.82) 100%)' }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 55% at 28% 50%, ${slide.accentColor}22 0%, transparent 65%)` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,0,20,0.65) 0%, transparent 45%)' }} />

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 animate-blob" style={{ background: slide.accentColor }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-10 animate-blob" style={{ background: '#6366F1', animationDelay: '3s' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24 flex flex-col lg:flex-row items-center gap-14">
          {/* Left */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border border-white/15 bg-white/5 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: slide.accentColor, boxShadow: `0 0 8px ${slide.accentColor}` }} />
              <span className="text-sm font-semibold text-white/80 tracking-wide">{slide.badge}</span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-heading font-extrabold text-white mb-6 leading-[1.07] tracking-tight">
              {slide.title}
              <br />
              <span style={{ background: `linear-gradient(135deg, ${slide.accentColor} 0%, #C1BFFF 60%, #BDB96A 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {slide.highlight}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300/90 mb-10 leading-relaxed max-w-xl">{slide.subtitle}</p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button onClick={() => navigate('/register')}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
                style={{ background: `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}bb)`, boxShadow: `0 8px 32px ${slide.accentColor}55` }}>
                Start Free Trial <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button onClick={() => navigate('/features')}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/8 backdrop-blur-md text-white font-bold text-base rounded-2xl border border-white/15 hover:bg-white/15 hover:border-white/30 transition-all">
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <Play size={12} fill="white" className="ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {[{ icon: Shield, text: 'IT Act Compliant' }, { icon: Award, text: 'SOC 2 Certified' }, { icon: Globe, text: '10+ Countries' }, { icon: Users, text: '10K+ Businesses' }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon size={13} style={{ color: slide.accentColor }} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Floating cards */}
          <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
            <div className="bg-white/7 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${slide.accentColor},${slide.accentColor}88)` }}>
                  <TrendingUp size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">Platform Stats</p>
                  <p className="text-sm font-bold text-white">Live Dashboard</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[{ val: '50K+', label: 'Contracts' }, { val: '10x', label: 'Faster' }, { val: '98%', label: 'Satisfaction' }, { val: '₹500Cr+', label: 'Deals' }].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                    <div className="text-lg font-extrabold font-heading" style={{ background: `linear-gradient(135deg,${slide.accentColor},#C1BFFF)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/7 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
                  <Brain size={15} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">AI Risk Check</span>
              </div>
              <div className="space-y-2">
                {[{ color: 'green', icon: CheckCircle, text: 'Payment terms: Clear', bg: 'bg-green-500/10 border-green-500/20' }, { color: 'amber', icon: Bell, text: 'Add Force Majeure clause', bg: 'bg-amber-500/10 border-amber-500/20' }, { color: '#CF6DFC', icon: Zap, text: '3 optimizations ready', bg: 'bg-purple-500/10 border-purple-500/20' }].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 ${item.bg} border rounded-xl px-3 py-2`}>
                    <item.icon size={12} style={{ color: i === 0 ? '#4ade80' : i === 1 ? '#fbbf24' : '#CF6DFC' }} />
                    <span className="text-xs text-white/70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/7 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl">
              <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wide">Recent Activity</p>
              <div className="space-y-2.5">
                {[{ action: 'NDA Signed', time: '2m ago', color: '#4ade80' }, { action: 'Contract Drafted', time: '15m ago', color: '#CF6DFC' }, { action: 'Approval Sent', time: '1h ago', color: '#38BDF8' }].map(item => (
                  <div key={item.action} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-gray-300 flex-1">{item.action}</span>
                    <span className="text-xs text-gray-600">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 backdrop-blur-md border border-white/15 text-white hover:bg-white/18 transition-all">
              <ChevronLeft size={16} />
            </button>
            {HERO_SLIDES.map((s, idx) => (
              <button key={idx} onClick={() => goToSlide(idx)}
                className="rounded-full transition-all duration-400"
                style={{ width: idx === currentSlide ? 28 : 10, height: 10, background: idx === currentSlide ? s.accentColor : 'rgba(255,255,255,0.3)', boxShadow: idx === currentSlide ? `0 0 12px ${s.accentColor}` : 'none' }} />
            ))}
            <button onClick={() => goToSlide((currentSlide + 1) % HERO_SLIDES.length)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 backdrop-blur-md border border-white/15 text-white hover:bg-white/18 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════ TICKER STRIP ══════════════ */}
      <section className="py-4 overflow-hidden border-y" style={{ background: 'linear-gradient(90deg,#CF6DFC,#9B4FD0,#6366F1,#0EA5E9,#00C9A7,#CF6DFC)', borderColor: 'transparent' }}>
        <div className="flex">
          <div className="ticker-track flex items-center gap-0 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-white text-sm font-semibold px-6 opacity-90">
                {item} <span className="mx-3 opacity-40">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="py-16 bg-white dark:bg-[#0c0814]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-3xl p-6 text-center hover-lift transition-all`}>
                <div className={`text-4xl font-heading font-extrabold mb-2 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TRUSTED BY ══════════════ */}
      <section className="py-10 bg-[#FDFBD4] dark:bg-[#080510]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-7">Trusted by leading companies across India</p>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {TRUSTED_BY.map(brand => (
              <div key={brand} className="px-5 py-2.5 bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-[#CF6DFC] hover:text-[#CF6DFC] hover:shadow-lg hover:shadow-purple-100/50 transition-all cursor-default">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURE TABS ══════════════ */}
      <section className="py-28 bg-white dark:bg-[#0c0814] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5 text-sm font-semibold" style={{ background: 'rgba(207,109,252,0.1)', color: '#CF6DFC', border: '1px solid rgba(207,109,252,0.2)' }}>
              <Sparkles size={13} /> Core Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-5 leading-tight">
              Everything you need to<br />
              <span style={{ background: 'linear-gradient(135deg,#CF6DFC,#FF6B6B,#FFBA08)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                manage contracts intelligently
              </span>
            </h2>
            <p className="text-lg text-[#4B5563] dark:text-gray-400 max-w-2xl mx-auto">From AI-powered drafting to secure signatures — the complete contract lifecycle platform built for Indian businesses.</p>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {FEATURES_TABS.map((tab, i) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveFeatureTab(i)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeFeatureTab === i ? 'text-white shadow-xl scale-[1.04]' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                  style={activeFeatureTab === i ? { background: `linear-gradient(135deg,${tab.color}dd,${tab.color}88)`, boxShadow: `0 8px 24px ${tab.color}44` } : {}}>
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-left" key={activeFeatureTab}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold mb-6"
                style={{ background: `${FEATURES_TABS[activeFeatureTab].color}18`, color: FEATURES_TABS[activeFeatureTab].color, border: `1px solid ${FEATURES_TABS[activeFeatureTab].color}30` }}>
                <Sparkles size={12} /> {FEATURES_TABS[activeFeatureTab].highlight}
              </div>
              <h3 className="text-3xl font-heading font-extrabold text-[#111827] dark:text-white mb-6">{FEATURES_TABS[activeFeatureTab].label} Features</h3>
              <div className="space-y-3 mb-8">
                {FEATURES_TABS[activeFeatureTab].features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8 hover:border-opacity-80 transition-all"
                    style={{ '--hover-color': FEATURES_TABS[activeFeatureTab].color } as React.CSSProperties}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${FEATURES_TABS[activeFeatureTab].color}20` }}>
                      <CheckCircle size={14} style={{ color: FEATURES_TABS[activeFeatureTab].color }} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/features"
                className="inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all"
                style={{ color: FEATURES_TABS[activeFeatureTab].color }}>
                Explore all features <ArrowRight size={15} />
              </Link>
            </div>

            {/* Visual card */}
            <div className="animate-slide-right" key={`card-${activeFeatureTab}`}>
              <div className="relative rounded-3xl p-7 shadow-2xl border dark:border-white/8 overflow-hidden"
                style={{ background: `linear-gradient(135deg,${FEATURES_TABS[activeFeatureTab].color}10,${FEATURES_TABS[activeFeatureTab].color}05)`, borderColor: `${FEATURES_TABS[activeFeatureTab].color}20` }}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: `${FEATURES_TABS[activeFeatureTab].color}18` }} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ background: `linear-gradient(135deg,${FEATURES_TABS[activeFeatureTab].color},${FEATURES_TABS[activeFeatureTab].color}88)` }}>
                      {(() => { const Icon = FEATURES_TABS[activeFeatureTab].icon; return <Icon size={22} className="text-white" />; })()}
                    </div>
                    <div>
                      <p className="font-bold text-[#111827] dark:text-white">{FEATURES_TABS[activeFeatureTab].label}</p>
                      <p className="text-xs text-gray-500">UniqueContracts AI</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: `${FEATURES_TABS[activeFeatureTab].color}18`, border: `1px solid ${FEATURES_TABS[activeFeatureTab].color}30` }}>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: FEATURES_TABS[activeFeatureTab].color }} />
                      <span className="text-xs font-semibold" style={{ color: FEATURES_TABS[activeFeatureTab].color }}>Active</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {FEATURES_TABS[activeFeatureTab].features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/60 dark:bg-white/5 rounded-xl px-4 py-3 border border-white/20 dark:border-white/5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: `${FEATURES_TABS[activeFeatureTab].color}25` }}>
                          <Check size={11} style={{ color: FEATURES_TABS[activeFeatureTab].color }} />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 p-4 rounded-2xl text-center font-bold text-lg" style={{ background: `linear-gradient(135deg,${FEATURES_TABS[activeFeatureTab].color}18,transparent)`, color: FEATURES_TABS[activeFeatureTab].color }}>
                    {FEATURES_TABS[activeFeatureTab].highlight} ✨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-28 relative overflow-hidden mesh-bg-1">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5 text-sm font-semibold bg-teal-50 dark:bg-teal-900/20 text-[#00C9A7] border border-teal-200 dark:border-teal-800">
              <Clock size={13} /> Simple 4-Step Process
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">
              How <span className="gradient-text">UniqueContracts</span> works
            </h2>
            <p className="text-lg text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto">
              From idea to fully executed agreement in four simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative group">
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-px z-0"
                      style={{ background: `linear-gradient(90deg,${step.glow},transparent)` }} />
                  )}
                  <div className="bg-white dark:bg-[#130d20] rounded-3xl p-6 border border-gray-100 dark:border-white/8 hover-lift hover-glow relative z-10 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                        style={{ boxShadow: `0 8px 24px ${step.glow}` }}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className="text-3xl font-black text-gray-100 dark:text-white/10 select-none">{step.step}</span>
                    </div>
                    <h3 className="font-heading font-bold text-[#111827] dark:text-white mb-2 text-lg">{step.title}</h3>
                    <p className="text-sm text-[#4B5563] dark:text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ COMPARISON TABLE ══════════════ */}
      <section className="py-28 bg-white dark:bg-[#0c0814]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5 text-sm font-semibold bg-rose-50 dark:bg-rose-900/20 text-[#F43F5E] border border-rose-200 dark:border-rose-800">
              <Target size={13} /> How We Compare
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">
              Why choose <span className="gradient-text-coral">UniqueContracts</span>?
            </h2>
            <p className="text-lg text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto">See how we stack up against traditional tools and competitors.</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-white/8 shadow-2xl shadow-gray-100/50 dark:shadow-black/30">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/3">
                  <th className="text-left text-sm font-semibold text-gray-500 dark:text-gray-400 px-6 py-5 w-1/2">Feature</th>
                  {Object.keys(COMPARISON.competitors).map(name => (
                    <th key={name} className={`text-center text-sm font-bold px-6 py-5 ${name === 'UniqueContracts' ? 'text-[#CF6DFC]' : 'text-gray-500 dark:text-gray-400'}`}>
                      {name === 'UniqueContracts' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs" style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
                          <Sparkles size={11} /> {name}
                        </span>
                      ) : name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.features.map((feature, rowIdx) => (
                  <tr key={feature} className={`border-t border-gray-50 dark:border-white/5 ${rowIdx % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-white/2'}`}>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{feature}</td>
                    {Object.entries(COMPARISON.competitors).map(([name, vals]) => (
                      <td key={name} className="px-6 py-4 text-center">
                        {vals[rowIdx] ? (
                          <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${name === 'UniqueContracts' ? 'bg-[#CF6DFC]' : 'bg-green-100 dark:bg-green-900/30'}`}>
                            <Check size={14} className={name === 'UniqueContracts' ? 'text-white' : 'text-green-600'} />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 dark:bg-red-900/20">
                            <X size={14} className="text-red-400" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#080510 0%,#0e0520 50%,#080510 100%)' }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CF6DFC]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C9A7]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5 text-sm font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Star size={13} fill="currentColor" /> Customer Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
              Loved by legal teams <span style={{ background: 'linear-gradient(135deg,#CF6DFC,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>everywhere</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name}
                className={`rounded-3xl p-6 border border-white/8 hover-lift transition-all ${i === 1 ? 'md:-mt-4' : ''}`}
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', boxShadow: i === 1 ? '0 24px 48px rgba(207,109,252,0.15)' : '0 8px 24px rgba(0,0,0,0.2)' }}>
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Metric badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-4 border" style={{ background: 'rgba(207,109,252,0.1)', borderColor: 'rgba(207,109,252,0.2)' }}>
                  <span className="text-lg font-black text-[#CF6DFC]">{t.metric}</span>
                  <span className="text-xs text-gray-400">{t.metricLabel}</span>
                </div>

                <Quote size={20} className="text-[#CF6DFC]/40 mb-3" />
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-xl border border-white/10" />
                  <div>
                    <p className="font-bold text-sm text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PRICING PREVIEW ══════════════ */}
      <section className="py-28 mesh-bg-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-5 text-sm font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Layers size={13} /> Simple Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">
              Transparent pricing,<br /><span className="gradient-text-teal">no surprises</span>
            </h2>
            <div className="flex items-center justify-center gap-2 mt-6">
              {(['monthly', 'yearly'] as const).map(cycle => (
                <button key={cycle} onClick={() => setBillingCycle(cycle)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${billingCycle === cycle ? 'bg-[#CF6DFC] text-white shadow-lg shadow-purple-300/40' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                  {cycle === 'yearly' ? <>Yearly <span className="text-[10px] ml-1 text-emerald-400 font-bold">SAVE 17%</span></> : 'Monthly'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan, i) => (
              <div key={plan.id} className={`relative rounded-3xl p-7 border transition-all hover-lift ${plan.popular ? 'border-[#CF6DFC]/50 shadow-2xl shadow-purple-200/40 dark:shadow-purple-900/30' : 'border-gray-200 dark:border-white/8 bg-white dark:bg-[#0c0814]'}`}
                style={plan.popular ? { background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' } : {}}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-black text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#FFBA08,#FF8E53)' }}>
                    🔥 MOST POPULAR
                  </div>
                )}
                <h3 className={`font-heading font-bold text-xl mb-1 ${plan.popular ? 'text-white' : 'text-[#111827] dark:text-white'}`}>{plan.name}</h3>
                <p className={`text-sm mb-5 ${plan.popular ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>{plan.description}</p>
                <div className={`text-5xl font-extrabold font-heading mb-6 ${plan.popular ? 'text-white' : 'text-[#CF6DFC]'}`}>
                  {plan.currency}{(billingCycle === 'yearly' ? Math.floor(plan.yearlyPrice / 12) : plan.price).toLocaleString('en-IN')}
                  <span className={`text-base font-normal ${plan.popular ? 'text-purple-200' : 'text-gray-400'}`}>/mo</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.slice(0, 6).map(f => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                        <Check size={11} className={plan.popular ? 'text-white' : 'text-[#CF6DFC]'} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register"
                  className={`block text-center py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] ${plan.popular ? 'bg-white text-[#CF6DFC] hover:bg-purple-50 shadow-lg' : 'text-white shadow-lg shadow-purple-200/40 dark:shadow-purple-900/30'}`}
                  style={!plan.popular ? { background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' } : {}}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="inline-flex items-center gap-1.5 text-[#CF6DFC] font-semibold hover:gap-3 transition-all text-sm">
              Compare all plans <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ INTEGRATIONS ══════════════ */}
      <section className="py-20 bg-[#FDFBD4] dark:bg-[#080510]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-6 text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Database size={13} /> 50+ Integrations
          </span>
          <h3 className="text-3xl font-heading font-extrabold text-[#111827] dark:text-white mb-3">Integrates with your favorite tools</h3>
          <p className="text-[#4B5563] dark:text-gray-400 mb-10">Connect UniqueContracts with your existing workflow. Zero friction.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map(tool => (
              <div key={tool} className="px-5 py-3 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/8 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-[#CF6DFC] hover:text-[#CF6DFC] hover:shadow-lg hover:shadow-purple-100/50 dark:hover:shadow-purple-900/20 hover:scale-[1.03] transition-all cursor-default shadow-sm">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SECURITY SECTION ══════════════ */}
      <section className="py-24 bg-white dark:bg-[#0c0814]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-6 text-sm font-semibold bg-teal-50 dark:bg-teal-900/20 text-[#00C9A7] border border-teal-200 dark:border-teal-800">
                <Lock size={13} /> Enterprise Security
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-6">
                Your contracts are<br />
                <span className="gradient-text-teal">fortress-protected</span>
              </h2>
              <p className="text-lg text-[#4B5563] dark:text-gray-400 mb-8 leading-relaxed">
                We use bank-grade encryption and industry-standard security practices to keep your most sensitive agreements safe.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: 'AES-256 Encryption', desc: 'All data encrypted at rest & in transit', color: '#CF6DFC' },
                  { icon: Lock, label: 'SOC 2 Type II', desc: 'Independently audited security controls', color: '#00C9A7' },
                  { icon: Award, label: 'IT Act 2000', desc: 'Fully compliant with Indian digital law', color: '#FFBA08' },
                  { icon: Activity, label: 'Audit Trails', desc: 'Every action timestamped & logged', color: '#FF6B6B' },
                  { icon: Globe, label: 'ISO 27001', desc: 'International information security standard', color: '#6366F1' },
                  { icon: GitBranch, label: '99.97% Uptime', desc: 'SLA-backed infrastructure reliability', color: '#38BDF8' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}18` }}>
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827] dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Visual */}
            <div className="relative">
              <div className="relative rounded-3xl p-8 overflow-hidden border border-teal-200/30 dark:border-teal-800/30"
                style={{ background: 'linear-gradient(135deg,rgba(0,201,167,0.06),rgba(56,189,248,0.04))' }}>
                <div className="absolute top-4 right-4 w-32 h-32 bg-[#00C9A7]/10 rounded-full blur-2xl" />
                <div className="space-y-3">
                  {[
                    { label: 'Data Encryption', status: 'AES-256 Active', progress: 100, color: '#00C9A7' },
                    { label: 'Access Control', status: 'Role-Based', progress: 100, color: '#CF6DFC' },
                    { label: 'Audit Logging', status: 'Real-time', progress: 100, color: '#6366F1' },
                    { label: 'Backup Status', status: 'Synced 2m ago', progress: 97, color: '#FFBA08' },
                    { label: 'Threat Detection', status: '0 alerts', progress: 100, color: '#FF6B6B' },
                  ].map(item => (
                    <div key={item.label} className="bg-white/60 dark:bg-white/3 rounded-2xl p-4 border border-white/20 dark:border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">{item.label}</span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: `${item.color}18`, color: item.color }}>
                          {item.status}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${item.progress}%`, background: `linear-gradient(90deg,${item.color},${item.color}88)` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00C9A7]/10 border border-[#00C9A7]/20">
                    <div className="w-2 h-2 bg-[#00C9A7] rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-[#00C9A7]">All Systems Secure & Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
