import { ArrowUpRight, BookOpen, CheckCircle2, Eye, FileEdit, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { StatusBadge } from '../components/articles/StatusBadge';
import { useArticles } from '../hooks/useArticles';

/**
 * Dashboard stats page. Calculates counts dynamically, presents
 * premium stats cards, quick links, and a recent articles overview.
 */
export function DashboardPage() {
  const { data: articles, isLoading, error } = useArticles();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-effect p-8 rounded-2xl text-center text-rose-400">
        Error loading dashboard statistics: {error.message}
      </div>
    );
  }

  const allArticles = articles || [];
  const total = allArticles.length;
  const published = allArticles.filter((a) => a.status === 'published').length;
  const drafts = allArticles.filter((a) => a.status === 'draft').length;
  const recentArticles = allArticles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = [
    {
      label: 'Total Articles',
      value: total,
      icon: BookOpen,
      color: 'text-purple-400 bg-purple-500/10',
    },
    {
      label: 'Published Articles',
      value: published,
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'Draft Articles',
      value: drafts,
      icon: FileEdit,
      color: 'text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Platform activity and content breakdown</p>
        </div>
        <div className="flex gap-3">
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border-dark)] text-sm font-medium text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            <span>Public Site</span>
            <ArrowUpRight size={16} />
          </a>
          <Link
            to="/articles/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover-glow transition-all duration-200"
          >
            <Plus size={16} />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-effect p-6 rounded-2xl flex items-center justify-between shadow-lg"
            >
              <div className="space-y-2">
                <span className="text-sm text-slate-400 font-medium">{stat.label}</span>
                <p className="text-4xl font-extrabold text-slate-100">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Articles & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Articles */}
        <div className="lg:col-span-2 glass-effect p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-100">Recent Content</h2>
            <Link
              to="/articles"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <Eye size={12} />
            </Link>
          </div>

          <div className="divide-y divide-[var(--color-border-dark)]">
            {recentArticles.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">
                No articles available. Create one to get started!
              </p>
            ) : (
              recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="py-4 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <div className="space-y-1 pr-4">
                    <h3 className="font-semibold text-slate-200 text-sm hover:text-purple-400 transition-colors line-clamp-1">
                      <Link to={`/articles/edit/${article.id}`}>{article.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </p>
                  </div>
                  <StatusBadge status={article.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Help Card */}
        <div className="glass-effect p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h2 className="font-bold text-lg text-slate-100">Writing Tip</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ensure your articles have clear summaries and detailed content before publication. You
              can draft articles and preview them here before publishing them to the public grid.
            </p>
          </div>

          <div className="bg-purple-950/20 border border-purple-500/20 p-4 rounded-xl">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
              System Note
            </span>
            <p className="text-xs text-slate-400 leading-normal">
              Seeded articles include Arabic Unicode examples to test routing and slugs correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
