import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin, Tag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/features/ScrollToTop';
import { BLOG_POSTS } from '@/constants';
import { formatDate } from '@/lib/utils';

export default function BlogPost() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);
  const related = BLOG_POSTS.filter(p => p.id !== id).slice(0, 3);

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBD4] dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Post not found</h1>
        <Link to="/blog" className="text-[#CF6DFC] font-semibold hover:underline">← Back to Blog</Link>
      </div>
    </div>
  );

  const sampleContent = `
## Introduction

${post.excerpt}

In today's rapidly evolving legal technology landscape, businesses of all sizes are discovering the transformative power of digital contract management. The shift from paper-based contracts to AI-powered platforms has been accelerating, especially in India's booming startup ecosystem.

## Key Challenges in Traditional Contract Management

Before we dive into solutions, let's acknowledge the problems that plague traditional contract workflows:

- **Time-consuming drafting**: Legal teams spend hours creating contracts from scratch
- **Version confusion**: Multiple email threads with conflicting document versions
- **Signature delays**: Wet signature requirements slow down deal closures significantly
- **Poor visibility**: No centralized view of contract status and deadlines
- **Compliance risks**: Missing clauses and outdated templates create legal exposure

## How AI is Changing the Game

Artificial intelligence is revolutionizing every step of the contract lifecycle, from initial drafting to final archival. Modern AI systems can:

1. **Draft contracts in minutes** — Describe what you need, and AI generates a complete first draft
2. **Detect risk automatically** — Machine learning models identify problematic clauses before signing
3. **Recommend improvements** — AI suggests missing protective clauses based on contract type
4. **Extract key data** — Automatically pull parties, dates, values, and obligations from contracts

## Best Practices for Implementation

When rolling out a contract management platform, consider these proven strategies:

**Start with high-volume contract types**: Identify which contract types you create most frequently and templatize those first.

**Involve legal and business teams equally**: The best implementations treat CLM as a business productivity tool, not just a legal tool.

**Measure baseline metrics**: Before deployment, track how long contracts take from creation to signature. This becomes your benchmark.

## Conclusion

The future of contract management is intelligent, automated, and connected. Organizations that embrace AI-powered platforms today will have a significant competitive advantage in deal velocity, legal protection, and operational efficiency.

${post.author} is ${post.authorRole} with expertise in legal technology and digital transformation.
  `.trim();

  return (
    <div className="min-h-screen bg-[#FDFBD4] dark:bg-gray-950">
      <Navbar />

      <article className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#CF6DFC] transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Blog
          </Link>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-[#CF6DFC] text-sm font-semibold rounded-full">{post.category}</span>
            <span className="flex items-center gap-1 text-sm text-gray-400"><Calendar size={13} /> {formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1 text-sm text-gray-400"><Clock size={13} /> {post.readTime} min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] dark:text-white mb-6 leading-tight">{post.title}</h1>

          {/* Author */}
          <div className="flex items-center justify-between mb-10 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={post.author} className="w-12 h-12 rounded-xl border-2 border-purple-100" />
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{post.author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{post.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 mr-2">Share:</span>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-[#CF6DFC] hover:text-white transition-colors">
                <Twitter size={15} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-[#CF6DFC] hover:text-white transition-colors">
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-2xl overflow-hidden mb-10 h-72 md:h-96">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {sampleContent.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-heading font-bold text-[#111827] dark:text-white mt-8 mb-4">{line.replace('## ', '')}</h2>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-gray-800 dark:text-white mb-3">{line.replace(/\*\*/g, '')}</p>;
              if (line.startsWith('- ')) return <li key={i} className="text-[#4B5563] dark:text-gray-400 ml-4 mb-2">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
              if (line.match(/^\d+\. /)) return <p key={i} className="text-[#4B5563] dark:text-gray-400 mb-2 pl-4">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="text-[#4B5563] dark:text-gray-400 mb-4 leading-relaxed">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            {post.tags.map(t => (
              <span key={t} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300 rounded-lg">
                <Tag size={12} /> {t}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-[#111827] dark:text-white mb-8">Related Articles</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.id} to={`/blog/${p.id}`} className="group bg-[#FDFBD4] dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-[#CF6DFC]/30 hover:shadow-lg transition-all">
                <div className="h-40 overflow-hidden">
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium text-[#CF6DFC] block mb-2">{p.category}</span>
                  <h3 className="font-heading font-bold text-sm text-[#111827] dark:text-white group-hover:text-[#CF6DFC] transition-colors line-clamp-2">{p.title}</h3>
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
