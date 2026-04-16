import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';
import { BLOG_POSTS } from '@/constants';
import { formatDate } from '@/lib/utils';

const CATEGORIES = ['All', 'AI & Technology', 'Legal Tips', 'Compliance', 'Case Study', 'Marketing'];

export default function Blog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = BLOG_POSTS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const featured = BLOG_POSTS.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured || search || category !== 'All');

  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] text-sm font-semibold rounded-full inline-block mb-4">The Blog</span>
            <h1 className="text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-4">
              Insights on <span className="gradient-text">legal tech & contracts</span>
            </h1>
            <p className="text-lg text-[#4B5563] dark:text-gray-400 max-w-xl mx-auto">Expert articles on contract management, AI in legal tech, and best practices for Indian businesses.</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-[#CF6DFC] text-gray-700 dark:text-gray-300" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'gradient-primary text-white shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#CF6DFC] hover:text-[#CF6DFC]'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featured && search === '' && category === 'All' && (
            <Link to={`/blog/${featured.id}`} className="group block bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-[#CF6DFC]/30 hover:shadow-xl transition-all mb-10">
              <div className="grid lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img src={featured.coverImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] text-xs font-semibold rounded-full inline-block mb-4 w-fit">FEATURED</span>
                  <h2 className="text-2xl font-heading font-bold text-[#111827] dark:text-white mb-3 group-hover:text-[#CF6DFC] transition-colors">{featured.title}</h2>
                  <p className="text-[#4B5563] dark:text-gray-400 mb-6 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${featured.author}`} alt={featured.author} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{featured.author}</p>
                        <p className="text-xs text-gray-400">{formatDate(featured.publishedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#CF6DFC] font-semibold text-sm group-hover:gap-2 transition-all">
                      Read <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Post Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(post => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-[#CF6DFC]/30 hover:shadow-lg transition-all">
                <div className="h-44 overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-[#CF6DFC] bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1 rounded-full">{post.category}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} /> {post.readTime} min read</span>
                  </div>
                  <h3 className="font-heading font-bold text-[#111827] dark:text-white mb-2 group-hover:text-[#CF6DFC] transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-[#4B5563] dark:text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={post.author} className="w-7 h-7 rounded-full" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{post.author}</p>
                      <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
