import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const SECTIONS = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using the UniqueContracts platform, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, you may not use our services. These terms apply to all users, including visitors, registered users, and subscribers.' },
  { title: '2. Description of Service', content: 'UniqueContracts provides a cloud-based contract lifecycle management platform, including contract creation tools, e-signature capabilities, workflow automation, analytics, and AI-powered features. Services are provided "as is" with features that may change over time as we improve the platform.' },
  { title: '3. User Accounts', content: 'You must register for an account to access most features. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You must promptly notify us of any unauthorized use of your account. Accounts are non-transferable without our written consent.' },
  { title: '4. Acceptable Use', content: 'You agree not to use the platform to create contracts for illegal purposes, upload malicious content, attempt to reverse engineer the platform, scrape data without permission, impersonate other users or entities, or violate the intellectual property rights of others.' },
  { title: '5. Contract Data and Ownership', content: 'You retain full ownership of contracts and documents you create or upload to the platform. By using our service, you grant UniqueContracts a limited license to host, process, and transmit your content solely to provide the service. We do not claim ownership of your contract data.' },
  { title: '6. E-Signatures', content: 'Electronic signatures facilitated through UniqueContracts are legally binding in India under the IT Act 2000 and its amendments, provided all parties have consented to electronic signing. We are not liable for disputes arising from the underlying contract agreements.' },
  { title: '7. Payment and Billing', content: 'Paid plans are billed in advance. Annual plans are non-refundable after the first 14 days. Monthly plans can be cancelled at any time with effect from the next billing cycle. All prices are in Indian Rupees and inclusive of applicable GST.' },
  { title: '8. Limitation of Liability', content: 'UniqueContracts shall not be liable for indirect, incidental, special, or consequential damages arising from use of the platform. Our aggregate liability shall not exceed the amount paid by you in the 12 months preceding the claim.' },
  { title: '9. Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka, India. Disputes shall first be attempted to be resolved through mediation before litigation.' },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#CF6DFC] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
          <span className="text-sm text-[#CF6DFC] font-semibold">Legal</span>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-[#111827] dark:text-white mb-3">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-12">Last updated: March 1, 2025 · Effective: April 1, 2025</p>
        <div className="space-y-6">
          {SECTIONS.map(s => (
            <div key={s.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-heading font-bold text-[#111827] dark:text-white mb-3">{s.title}</h2>
              <p className="text-[#4B5563] dark:text-gray-400 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">For questions about these terms, contact us at <a href="mailto:legal@uniquecontracts.in" className="text-[#CF6DFC] hover:underline">legal@uniquecontracts.in</a></p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
