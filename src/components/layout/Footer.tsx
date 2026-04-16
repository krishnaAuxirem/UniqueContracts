import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">UC</span>
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Unique<span className="text-[#CF6DFC]">Contracts</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              India's most powerful AI-driven contract lifecycle management platform. Streamline creation, signing, and management — all in one place.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#CF6DFC] flex items-center justify-center transition-colors">
                <Twitter size={16} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#CF6DFC] flex items-center justify-center transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#CF6DFC] flex items-center justify-center transition-colors">
                <Github size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#CF6DFC] flex items-center justify-center transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-[#CF6DFC] flex items-center justify-center transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Features', path: '/features' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'Templates', path: '/features' },
                { label: 'Integrations', path: '/features' },
                { label: 'Changelog', path: '/blog' },
                { label: 'Roadmap', path: '/about' },
              ].map(item => (
                <li key={item.path + item.label}>
                  <Link to={item.path} className="text-sm text-gray-400 hover:text-[#CF6DFC] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Blog', path: '/blog' },
                { label: 'Careers', path: '/about' },
                { label: 'Press', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Partners', path: '/contact' },
              ].map(item => (
                <li key={item.path + item.label}>
                  <Link to={item.path} className="text-sm text-gray-400 hover:text-[#CF6DFC] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Mail size={15} className="mt-0.5 text-[#CF6DFC] shrink-0" />
                <a href="mailto:hello@uniquecontracts.in" className="hover:text-[#CF6DFC] transition-colors">
                  hello@uniquecontracts.in
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Phone size={15} className="mt-0.5 text-[#CF6DFC] shrink-0" />
                <a href="tel:+918001234567" className="hover:text-[#CF6DFC] transition-colors">
                  +91 800 123 4567
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={15} className="mt-0.5 text-[#CF6DFC] shrink-0" />
                <span>WeWork, Koramangala<br />Bengaluru, KA 560034</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay in the loop</h4>
              <p className="text-sm text-gray-400">Get product updates, legal tips, and industry insights.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-64 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#CF6DFC]"
              />
              <button className="px-5 py-2.5 gradient-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            © {currentYear} UniqueContracts Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-[#CF6DFC] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-[#CF6DFC] transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-xs text-gray-500 hover:text-[#CF6DFC] transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
