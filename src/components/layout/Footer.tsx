import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Shield, Zap, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Templates', path: '/features' },
    { label: 'AI Contract Drafting', path: '/features' },
    { label: 'E-Signatures', path: '/features' },
    { label: 'Changelog', path: '/blog' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Careers', path: '/about' },
    { label: 'Press Kit', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Partners', path: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/privacy' },
    { label: 'GDPR Compliance', path: '/privacy' },
    { label: 'Security', path: '/about' },
    { label: 'IT Act Compliance', path: '/terms' },
  ],
};

const SOCIALS = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:bg-blue-600' },
  { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:bg-gray-600' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-400' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:bg-red-600' },
];

const TRUST_BADGES = [
  { icon: Shield, label: 'SOC 2 Type II', sub: 'Certified' },
  { icon: Award, label: 'IT Act 2000', sub: 'Compliant' },
  { icon: Zap, label: '99.97%', sub: 'Uptime SLA' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const year = new Date().getFullYear();

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) { toast.error('Please enter a valid email'); return; }
    toast.success('Subscribed! Welcome to the UniqueContracts community.');
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden">
      {/* CTA strip */}
      <div className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0414 0%, #1a0a2e 40%, #0d1a2e 100%)' }}>
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#CF6DFC]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#00C9A7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6366F1]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-purple-500/30 bg-purple-500/10">
            <div className="w-2 h-2 bg-[#CF6DFC] rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-purple-200">Join 10,000+ businesses</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-5 leading-tight">
            Ready to transform your<br />
            <span style={{ background: 'linear-gradient(135deg,#CF6DFC,#FF6B6B,#FFBA08)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              contract workflow?
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Start your 14-day free trial. No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register"
              className="flex items-center gap-2 px-8 py-4 font-bold text-white rounded-2xl text-base shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.03] transition-all"
              style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link to="/contact"
              className="flex items-center gap-2 px-8 py-4 font-bold text-white rounded-2xl text-base border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all">
              Book a Demo
            </Link>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {TRUST_BADGES.map(b => (
              <div key={b.label} className="flex items-center gap-2 text-gray-400">
                <b.icon size={15} className="text-[#00C9A7]" />
                <span className="text-sm font-semibold text-gray-300">{b.label}</span>
                <span className="text-xs text-gray-500">{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="bg-[#08030f] text-gray-400">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">

            {/* Brand col */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
                  <span className="text-white font-black text-sm">UC</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-lg text-white">
                    Unique<span style={{ background: 'linear-gradient(135deg,#CF6DFC,#FF6B6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contracts</span>
                  </span>
                  <div className="text-[9px] font-semibold text-[#00C9A7] uppercase tracking-widest">AI-Powered CLM</div>
                </div>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
                India's most powerful AI-driven contract lifecycle management platform. Create, sign, and manage contracts 10× faster.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2 mb-8">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:scale-110 hover:border-transparent ${s.color}`}>
                    <s.icon size={15} className="text-gray-300" />
                  </a>
                ))}
              </div>

              {/* Contact info */}
              <div className="space-y-2.5">
                {[
                  { icon: Mail, text: 'hello@uniquecontracts.in', href: 'mailto:hello@uniquecontracts.in' },
                  { icon: Phone, text: '+91 800 123 4567', href: 'tel:+918001234567' },
                  { icon: MapPin, text: 'Koramangala, Bengaluru, KA 560034', href: '#' },
                ].map(c => (
                  <a key={c.text} href={c.href} className="flex items-start gap-2.5 text-sm text-gray-500 hover:text-[#CF6DFC] transition-colors group">
                    <c.icon size={14} className="mt-0.5 text-[#CF6DFC] shrink-0" />
                    {c.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-5 text-sm tracking-wide">{category}</h4>
                <ul className="space-y-3">
                  {links.map(item => (
                    <li key={item.label}>
                      <Link to={item.path} className="text-sm text-gray-500 hover:text-[#CF6DFC] transition-colors leading-none">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl p-6 mb-10 border border-white/5"
            style={{ background: 'linear-gradient(135deg,rgba(207,109,252,0.06),rgba(99,102,241,0.06))' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h4 className="text-white font-bold mb-1">Stay ahead of the curve</h4>
                <p className="text-sm text-gray-500">Weekly legal tech insights, product updates & contract tips.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  className="flex-1 sm:w-60 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CF6DFC] transition-colors" />
                <button onClick={handleSubscribe}
                  className="px-5 py-3 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all whitespace-nowrap shadow-lg shadow-purple-900/30"
                  style={{ background: 'linear-gradient(135deg,#CF6DFC,#9B4FD0)' }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-600">
              © {year} UniqueContracts Technologies Pvt Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {[
                { label: '🇮🇳 Made in India', cls: 'text-gray-600' },
                { label: 'ISO 27001 Certified', cls: 'text-[#00C9A7]' },
                { label: 'SOC 2 Type II', cls: 'text-[#CF6DFC]' },
              ].map(b => (
                <span key={b.label} className={`text-xs font-medium ${b.cls}`}>{b.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
