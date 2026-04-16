import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, X, HelpCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';
import { PRICING_PLANS } from '@/constants';

const FEATURE_COMPARISON = [
  { feature: 'Active Contracts', starter: '5', professional: '50', enterprise: 'Unlimited' },
  { feature: 'E-Signatures / Month', starter: '3', professional: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Template Library', starter: 'Basic', professional: 'Full Access', enterprise: 'Custom Builder' },
  { feature: 'AI Contract Drafting', starter: false, professional: true, enterprise: true },
  { feature: 'Risk Detection', starter: false, professional: true, enterprise: true },
  { feature: 'Approval Workflows', starter: false, professional: true, enterprise: true },
  { feature: 'Version Control', starter: false, professional: true, enterprise: true },
  { feature: 'Analytics & Reports', starter: 'Basic', professional: 'Advanced', enterprise: 'Custom' },
  { feature: 'Storage', starter: '1 GB', professional: '50 GB', enterprise: 'Unlimited' },
  { feature: 'API Access', starter: false, professional: true, enterprise: true },
  { feature: 'Custom Branding', starter: false, professional: false, enterprise: true },
  { feature: 'Dedicated Support', starter: false, professional: false, enterprise: true },
];

const FAQS = [
  { q: 'Is there a free trial?', a: 'Yes! Every plan comes with a 14-day free trial. No credit card required to start.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Absolutely. You can upgrade anytime and get prorated billing. Downgrades take effect at the next billing cycle.' },
  { q: 'Are e-signatures legally valid in India?', a: 'Yes, UniqueContracts uses Aadhaar-based and email-based e-signatures that are fully compliant with the IT Act 2000.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, net banking, and bank transfers for annual plans.' },
  { q: 'Is my data secure?', a: 'We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. We are SOC 2 Type II certified.' },
  { q: 'Do you offer custom enterprise pricing?', a: 'Yes. For teams above 100 users or specialized needs, contact our sales team for a custom quote.' },
];

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const renderCell = (value: string | boolean) => {
    if (value === true) return <CheckCircle size={16} className="text-green-500 mx-auto" />;
    if (value === false) return <X size={14} className="text-gray-300 mx-auto" />;
    return <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] text-sm font-semibold rounded-full inline-block mb-4">Simple Pricing</span>
            <h1 className="text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">
              Transparent plans,<br /><span className="gradient-text">no hidden charges</span>
            </h1>
            <p className="text-xl text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto mb-8">Start for free, scale as you grow. All prices in Indian Rupees.</p>
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setBilling('monthly')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${billing === 'monthly' ? 'gradient-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>Monthly</button>
              <button onClick={() => setBilling('yearly')} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${billing === 'yearly' ? 'gradient-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>
                Yearly <span className="ml-1 text-xs text-green-500">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {PRICING_PLANS.map(plan => (
              <div key={plan.id} className={`relative rounded-2xl p-8 ${plan.popular ? 'gradient-primary text-white shadow-2xl scale-105' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-400 text-white text-xs font-bold rounded-full shadow-lg">MOST POPULAR</div>}
                <h3 className={`text-xl font-heading font-bold mb-1 ${plan.popular ? 'text-white' : 'text-[#111827] dark:text-white'}`}>{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>{plan.description}</p>
                <div className={`text-5xl font-extrabold mb-1 ${plan.popular ? 'text-white' : 'text-[#CF6DFC]'}`}>
                  {plan.currency}{(billing === 'yearly' ? Math.floor(plan.yearlyPrice / 12) : plan.price).toLocaleString('en-IN')}
                </div>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-purple-200' : 'text-gray-400'}`}>per month{billing === 'yearly' ? ', billed annually' : ''}</p>
                {billing === 'yearly' && <p className={`text-xs mb-6 font-medium ${plan.popular ? 'text-purple-200' : 'text-green-600'}`}>Save {plan.currency}{(plan.price * 12 - plan.yearlyPrice).toLocaleString('en-IN')} per year</p>}
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      <CheckCircle size={14} className={`mt-0.5 shrink-0 ${plan.popular ? 'text-white' : 'text-[#CF6DFC]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block text-center py-3.5 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-[#CF6DFC] hover:bg-purple-50' : 'gradient-primary text-white hover:opacity-90 shadow-lg'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-16">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-heading font-bold text-[#111827] dark:text-white">Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Feature</th>
                    {PRICING_PLANS.map(p => (
                      <th key={p.id} className={`px-4 py-4 text-sm font-bold text-center ${p.popular ? 'text-[#CF6DFC]' : 'text-gray-600 dark:text-gray-300'}`}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {FEATURE_COMPARISON.map(row => (
                    <tr key={row.feature} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center">{renderCell(row.starter)}</td>
                      <td className="px-4 py-3.5 text-center">{renderCell(row.professional)}</td>
                      <td className="px-4 py-3.5 text-center">{renderCell(row.enterprise)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading font-extrabold text-center text-[#111827] dark:text-white mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{faq.q}</span>
                    <HelpCircle size={16} className={`text-[#CF6DFC] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-700 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
