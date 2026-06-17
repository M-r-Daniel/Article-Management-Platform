import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { ArticleCard } from '../components/articles/ArticleCard';
import { ArticleGrid } from '../components/articles/ArticleGrid';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePublishedArticles } from '../hooks/usePublicArticles';

/**
 * Public HomePage. Shows hero banner with CSS gradient, latest 6 articles,
 * and handles loading states with skeleton arrays.
 */
export function HomePage() {
  const { data: articles, isLoading, error } = usePublishedArticles();

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center text-rose-400">
        Error loading articles: {error.message}
      </div>
    );
  }

  const latestArticles = (articles || [])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-16 py-8">
      {/* Hero section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Read articles on <span className="gradient-brand text-glow">Code & Architecture</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
          Explore technical insights, guidelines, and expert opinions on full-stack development,
          TypeScript type safety, database design, and modern dev tools.
        </p>
        <div className="flex justify-center pt-2">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-bg text-white font-semibold text-sm hover-glow transition-all"
          >
            <span>Explore Articles</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Latest Articles grid section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border-dark)] pb-4">
          <h2 className="text-2xl font-bold text-slate-100">Latest Insights</h2>
          <Link
            to="/articles"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <ArticleGrid>
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </ArticleGrid>
        ) : latestArticles.length === 0 ? (
          <div className="glass-panel p-16 text-center space-y-4 rounded-2xl">
            <div className="inline-flex p-4 bg-slate-800/30 rounded-full text-slate-500">
              <BookOpen size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-300">No articles published yet</h3>
              <p className="text-sm text-slate-500">
                Check back later or access the Admin Portal to publish one.
              </p>
            </div>
          </div>
        ) : (
          <ArticleGrid>
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ArticleGrid>
        )}
      </section>
    </div>
  );
}
export default HomePage;
