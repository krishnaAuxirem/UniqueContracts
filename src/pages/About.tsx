import { Link } from 'react-router-dom';
import { Shield, Zap, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';

const TEAM = [
  { name: 'Aditya Raj', role: 'CEO & Co-founder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya', desc: 'Former Legal Tech Lead at LegalZoom India. 12 years in contract automation.' },
  { name: 'Sneha Patel', role: 'CTO & Co-founder', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', desc: 'Ex-Principal Engineer at Salesforce. Building AI products for 8+ years.' },
  { name: 'Karan Malhotra', role: 'VP Product', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan', desc: 'Product leader with experience at Juro and DocuSign. Customer-obsessed.' },
  { name: 'Divya Nair', role: 'Head of Legal', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Divya', desc: 'Advocate, Supreme Court of India. Expert in IT Act and digital contracts law.' },
  { name: 'Rahul Bansal', role: 'Head of Growth', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul2', desc: 'Growth hacker behind 3 successful SaaS exits. SMB and enterprise specialist.' },
  { name: 'Pooja Sharma', role: 'Lead AI Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja', desc: 'PhD in NLP from IIT Bombay. Building the brain that powers AI contract analysis.' },
];

const VALUES = [
  { icon: Shield, title: 'Trust & Security', desc: 'We believe your contracts are your most sensitive assets. We protect them like they are our own.' },
  { icon: Zap, title: 'Speed Without Compromise', desc: 'Fast should never mean reckless. We make contract management lightning-fast AND thorough.' },
  { icon: Users, title: 'Built for Teams', desc: 'Contracts involve multiple stakeholders. Our platform is designed for collaboration at every level.' },
  { icon: Award, title: 'Continuous Innovation', desc: 'Legal tech evolves fast. We ship features weekly, guided entirely by customer needs.' },
];

const MILESTONES = [
  { year: '2022', event: 'UniqueContracts founded in Bengaluru with seed funding of ₹2 crore' },
  { year: '2023', event: 'Launched v1.0 with 500 beta users. Raised Series A of ₹15 crore.' },
  { year: '2024', event: 'Crossed 5,000 active customers. Expanded to 10+ Indian states.' },
  { year: '2025', event: 'Launched AI Contract Intelligence. Serving 10,000+ teams across India.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] text-sm font-semibold rounded-full inline-block mb-6">Our Story</span>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-[#111827] dark:text-white mb-6 leading-tight">
            We're building the future of <span className="gradient-text">contract intelligence</span>
          </h1>
          <p className="text-xl text-[#4B5563] dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            UniqueContracts was born from a simple frustration: contracts were still being handled with email chains, Word documents, and wet signatures in a digital world. We knew there had to be a better way.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10K+', label: 'Active Teams' },
            { value: '₹500Cr+', label: 'Deals Facilitated' },
            { value: '50K+', label: 'Contracts Managed' },
            { value: '4.9★', label: 'Customer Rating' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl font-heading font-extrabold gradient-text">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[#FDFBD4] dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-extrabold text-center text-[#111827] dark:text-white mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover-lift">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#111827] dark:text-white mb-2">{v.title}</h3>
                  <p className="text-[#4B5563] dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-extrabold text-center text-[#111827] dark:text-white mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CF6DFC] to-[#C1BFFF]" />
            <div className="space-y-8 pl-12">
              {MILESTONES.map(m => (
                <div key={m.year} className="relative">
                  <div className="absolute -left-[2.35rem] w-5 h-5 gradient-primary rounded-full border-4 border-white dark:border-gray-900" />
                  <span className="text-sm font-bold text-[#CF6DFC] mb-1 block">{m.year}</span>
                  <p className="text-[#4B5563] dark:text-gray-400">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-[#FDFBD4] dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-extrabold text-center text-[#111827] dark:text-white mb-4">Meet the Team</h2>
          <p className="text-center text-[#4B5563] dark:text-gray-400 mb-12">Passionate builders, legal experts, and AI specialists united by one mission.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover-lift text-center">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl mx-auto mb-4 border-2 border-purple-100" />
                <h3 className="font-heading font-bold text-[#111827] dark:text-white">{member.name}</h3>
                <p className="text-sm text-[#CF6DFC] font-medium mb-2">{member.role}</p>
                <p className="text-xs text-[#4B5563] dark:text-gray-400 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-heading font-extrabold text-white mb-4">Join us in reimagining contracts</h2>
          <p className="text-purple-100 mb-8">Whether you're a creator, business, or enterprise — UniqueContracts has a plan for you.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#CF6DFC] font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-lg">
            Get Started Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
