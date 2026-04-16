import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when creating an account (name, email address, company details), information generated through your use of our services (contract data, activity logs, usage analytics), and technical information such as IP address, browser type, and device identifiers for security and fraud prevention purposes.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to provide and improve our services, process transactions, send service notifications, provide customer support, and comply with legal obligations. We use anonymized aggregate data for product analytics and improvement. We do not sell your personal data to third parties.`,
  },
  {
    title: '3. Data Storage and Security',
    content: `All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Our infrastructure is hosted in certified data centers in India, compliant with IT Act 2000 and applicable data protection regulations. We maintain SOC 2 Type II certification and conduct regular security audits.`,
  },
  {
    title: '4. Data Retention',
    content: `We retain your account data as long as your account is active. Contract documents and associated metadata are retained for 7 years by default (or longer if required by law), after which they are securely deleted. You may request deletion of your data at any time, subject to legal retention requirements.`,
  },
  {
    title: '5. Third-Party Services',
    content: `We integrate with third-party services including payment processors, cloud storage providers, and analytics tools. These partners are bound by data processing agreements and privacy standards equivalent to ours. We do not share your contract content with AI training datasets without explicit consent.`,
  },
  {
    title: '6. Your Rights',
    content: `Under applicable Indian data protection laws and GDPR (where applicable), you have the right to access, correct, delete, or export your personal data. You may also object to certain processing activities or withdraw consent where processing is based on consent. Contact privacy@uniquecontracts.in to exercise these rights.`,
  },
  {
    title: '7. Cookies',
    content: `We use essential cookies for platform functionality and session management. With your consent, we use analytics cookies to understand how our platform is used. You can manage cookie preferences through your browser settings or our cookie preference center.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy periodically. We will notify you of material changes via email or prominent notice on our platform at least 30 days before the changes take effect. Continued use of our services after the effective date constitutes acceptance of the updated policy.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#CF6DFC] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-sm text-[#CF6DFC] font-semibold">Legal</span>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-[#111827] dark:text-white mb-3">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-12">Last updated: March 15, 2025 · Effective: April 1, 2025</p>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-5 mb-10 border border-purple-100 dark:border-purple-800">
          <p className="text-[#4B5563] dark:text-gray-300 text-sm leading-relaxed">
            UniqueContracts Technologies Pvt Ltd ("we", "us", "our") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our platform at uniquecontracts.in.
          </p>
        </div>
        <div className="space-y-8">
          {SECTIONS.map(s => (
            <div key={s.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-heading font-bold text-[#111827] dark:text-white mb-3">{s.title}</h2>
              <p className="text-[#4B5563] dark:text-gray-400 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Questions about our privacy practices? Contact our Data Protection Officer at <a href="mailto:privacy@uniquecontracts.in" className="text-[#CF6DFC] hover:underline">privacy@uniquecontracts.in</a></p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
