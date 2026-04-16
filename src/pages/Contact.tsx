import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';
import { toast } from 'sonner';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { toast.error('Please fill all required fields'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent! We\'ll respond within 24 hours.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] text-sm font-semibold rounded-full inline-block mb-4">Get in Touch</span>
            <h1 className="text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">
              We'd love to <span className="gradient-text">hear from you</span>
            </h1>
            <p className="text-xl text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto">Whether you have a question, need a demo, or want to partner with us — our team is ready.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: Mail, title: 'Email Us', value: 'hello@uniquecontracts.in', sub: 'We reply within 24 hours', color: 'from-purple-500 to-violet-600' },
                { icon: Phone, title: 'Call Us', value: '+91 800 123 4567', sub: 'Mon–Fri, 9am–6pm IST', color: 'from-blue-500 to-cyan-600' },
                { icon: MapPin, title: 'Visit Us', value: 'WeWork, Koramangala', sub: 'Bengaluru, KA 560034', color: 'from-green-500 to-emerald-600' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-0.5">{item.title}</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{item.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={16} className="text-[#CF6DFC]" />
                  <p className="font-semibold text-[#111827] dark:text-white text-sm">Live Chat</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Chat with our support team in real-time during business hours.</p>
                <button className="text-sm text-[#CF6DFC] font-semibold hover:underline">Start a Chat →</button>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-100 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-[#111827] dark:text-white mb-2">Message Received!</h3>
                  <p className="text-gray-500 dark:text-gray-400">Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-[#CF6DFC] font-semibold hover:underline">Send another message</button>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Priya Sharma" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company</label>
                      <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white">
                        {['General Inquiry', 'Product Demo', 'Technical Support', 'Billing', 'Enterprise Sales', 'Partnership'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Tell us how we can help you..." className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-800 dark:text-white resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-lg">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Send Message</>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
