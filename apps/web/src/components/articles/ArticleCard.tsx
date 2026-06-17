import type { Article } from '@article-platform/shared';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';

interface ArticleCardProps {
  article: Article;
}

/**
 * Article card item for the public grid. Calculates read time dynamically,
 * formats dates, and renders with hover scale interactions.
 */
export function ArticleCard({ article }: ArticleCardProps) {
  // Estimate read time (approx. 200 words per minute)
  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="glass-panel rounded-2xl flex flex-col justify-between hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden group">
      <div className="p-6 space-y-4">
        {/* Date & Read Time Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" />
            <span>
              {new Date(article.createdAt).toLocaleDateString(undefined, {
                dateStyle: 'medium',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Title & Summary */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
            <Link to={`/articles/${article.slug}`}>{article.title}</Link>
          </h2>
          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{article.summary}</p>
        </div>
      </div>

      {/* Read Link */}
      <div className="px-6 pb-6 pt-2">
        <Link
          to={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300 group-hover:gap-2.5 transition-all"
        >
          <span>Read Full Article</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
export default ArticleCard;
