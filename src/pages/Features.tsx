import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, FileText, PenTool, Brain, GitBranch, Workflow, Shield, BarChart3, Search, Bell } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';

const FEATURES_DETAILED = [
  {
    icon: FileText, title: 'Contract Creation & Templates',
    color: 'from-purple-500 to-violet-600',
    points: ['Pre-built templates for 50+ contract types', 'Custom contract builder with drag-and-drop', 'Clause library with 500+ reusable clauses', 'Dynamic field placeholders auto-filled from CRM'],
  },
  {
    icon: PenTool, title: 'E-Signature System',
    color: 'from-pink-500 to-rose-600',
    points: ['Multi-party signing with order control', 'Sequential and parallel signing workflows', 'Real-time signature status tracking', 'IT Act 2000 and GDPR compliant'],
  },
  {
    icon: GitBranch, title: 'Version Control',
    color: 'from-blue-500 to-cyan-600',
    points: ['Complete change history with timestamps', 'Side-by-side diff comparison view', 'One-click rollback to any previous version', 'Commenting and suggestion system'],
  },
  {
    icon: Brain, title: 'AI Contract Intelligence',
    color: 'from-amber-500 to-orange-600',
    points: ['AI drafts contracts from natural language input', 'Intelligent clause recommendations by type', 'Risk detection with severity scoring', 'Compliance checking against jurisdiction'],
  },
  {
    icon: Workflow, title: 'Approval Automation',
    color: 'from-green-500 to-emerald-600',
    points: ['Multi-level approval chains', 'Conditional routing based on contract value', 'SLA tracking with escalation alerts', 'One-click approve/reject with comments'],
  },
  {
    icon: Shield, title: 'Security & Compliance',
    color: 'from-red-500 to-rose-600',
    points: ['AES-256 encryption at rest', 'TLS 1.3 for data in transit', 'Full audit trail for every action', 'SOC 2 Type II and ISO 27001 certified'],
  },
  {
    icon: BarChart3, title: 'Analytics Dashboard',
    color: 'from-teal-500 to-cyan-600',
    points: ['Real-time contract status overview', 'Expiry and renewal forecasting', 'Approval timeline tracking', 'Portfolio value and ROI reports'],
  },
  {
    icon: Search, title: 'Smart Repository',
    color: 'from-indigo-500 to-purple-600',
    points: ['Full-text search across all contracts', 'Advanced filtering by date, type, value, status', 'Automated tagging and categorization', 'Bulk export to PDF, CSV, or Word'],
  },
  {
    icon: Bell, title: 'Smart Notifications',
    color: 'from-yellow-500 to-amber-600',
    points: ['Configurable expiry reminders (90d, 30d, 7d)', 'Action-required alerts for approvals', 'Milestone notifications via email/SMS', 'Slack and Teams integration for alerts'],
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] text-sm font-semibold rounded-full inline-block mb-4">All Features</span>
          <h1 className="text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">
            Everything you need to<br /><span className="gradient-text">manage contracts intelligently</span>
          </h1>
          <p className="text-xl text-[#4B5563] dark:text-gray-400">Powerful, yet intuitive. From a solo creator to an enterprise legal team — UniqueContracts has every tool you need.</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {FEATURES_DETAILED.map((feature, idx) => {
            const Icon = feature.icon;
            const isEven = idx % 2 === 0;
            return (
              <div key={feature.title} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">{feature.title}</h2>
                  <ul className="space-y-3">
                    {feature.points.map(p => (
                      <li key={p} className="flex items-start gap-3 text-[#4B5563] dark:text-gray-400">
                        <CheckCircle size={16} className="text-[#CF6DFC] mt-0.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className={`bg-gradient-to-br ${feature.color} rounded-3xl p-8 opacity-10 h-48`} />
                  <div className={`-mt-44 bg-white dark:bg-gray-800 rounded-2xl p-6 mx-6 border border-gray-100 dark:border-gray-700 shadow-xl`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-white mb-1">{feature.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Integrated feature available across all plans.</p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-[#CF6DFC] rounded-lg">Pro</span>
                      <span className="text-xs px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">Enterprise</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-heading font-extrabold text-white mb-4">Ready to try every feature?</h2>
          <p className="text-purple-100 mb-8">Start your 14-day free trial and explore all Pro features at no cost.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#CF6DFC] font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-xl">
            Start Free Trial <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
