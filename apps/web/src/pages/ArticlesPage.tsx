import { BookOpen, Search } from 'lucide-react';
import { useState } from 'react';
import { ArticleCard } from '../components/articles/ArticleCard';
import { ArticleGrid } from '../components/articles/ArticleGrid';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePublishedArticles } from '../hooks/usePublicArticles';

/**
 * Public articles archive. Features client-side search indexing
 * and grid card rendering.
 */
export function ArticlesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: articles, isLoading, error } = usePublishedArticles();

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center text-rose-400">
        Error loading articles: {error.message}
      </div>
    );
  }

  const allArticles = articles || [];

  // Filter based on client keyword
  const filteredArticles = allArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-dark)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">All Articles</h1>
          <p className="text-slate-400 text-sm mt-1">Browse and search our technical archive</p>
        </div>

        {/* Live Search bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search archive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-[var(--color-border-dark)] rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <ArticleGrid>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </ArticleGrid>
      ) : filteredArticles.length === 0 ? (
        <div className="glass-panel p-16 text-center space-y-4 rounded-2xl">
          <div className="inline-flex p-4 bg-slate-800/30 rounded-full text-slate-500">
            <BookOpen size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-300">No articles found</h3>
            <p className="text-sm text-slate-500">
              {searchQuery
                ? 'Try refining your search keyword query.'
                : 'There are no published articles currently.'}
            </p>
          </div>
        </div>
      ) : (
        <ArticleGrid>
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ArticleGrid>
      )}
    </div>
  );
}
export default ArticlesPage;
