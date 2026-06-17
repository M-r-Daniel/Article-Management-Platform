import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { SkeletonDetail } from '../components/ui/Skeleton';
import { useArticleBySlug } from '../hooks/usePublicArticles';
import { NotFoundPage } from './NotFoundPage';

/**
 * Article detail page. Renders scroll indicator, calculates
 * read time, splits content into paragraphs, and displays metadata.
 */
export function ArticleDetailPage() {
  const { slug } = useParams();
  const { data: article, isLoading, error } = useArticleBySlug(slug || '');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <SkeletonDetail />;
  }

  if (error || !article) {
    return <NotFoundPage />;
  }

  // Calculate read time
  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="space-y-8 py-8 relative">
      {/* Scroll indicator bar */}
      <div
        className="fixed top-16 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Back button */}
      <div>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-[var(--color-border-dark)] pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-500" />
            <span>
              {new Date(article.createdAt).toLocaleDateString(undefined, {
                dateStyle: 'long',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-500" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </header>

      {/* Summary Highlight block */}
      <div className="bg-blue-950/10 border-l-4 border-blue-500 p-6 rounded-r-2xl">
        <p className="text-slate-300 text-lg font-medium leading-relaxed italic">
          {article.summary}
        </p>
      </div>

      {/* Body Content Prose paragraphs */}
      <div className="prose max-w-none">
        {article.content.split('\n\n').map((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;
          return <p key={index}>{trimmed}</p>;
        })}
      </div>
    </article>
  );
}
export default ArticleDetailPage;
