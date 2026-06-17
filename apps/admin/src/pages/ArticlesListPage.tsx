import type { Article } from '@article-platform/shared';
import { Edit2, FileX, Globe, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { DeleteConfirmModal } from '../components/articles/DeleteConfirmModal';
import { StatusBadge } from '../components/articles/StatusBadge';
import {
  useArticles,
  useDeleteArticle,
  usePublishArticle,
  useUnpublishArticle,
} from '../hooks/useArticles';

/**
 * Main Article listing table. Includes search, category tabs,
 * and button mappings for publish, unpublish, edit, and delete.
 */
export function ArticlesListPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  // Fetch articles based on filter
  const {
    data: articles,
    isLoading,
    error,
  } = useArticles(activeTab === 'all' ? undefined : activeTab);

  const deleteMutation = useDeleteArticle();
  const publishMutation = usePublishArticle();
  const unpublishMutation = useUnpublishArticle();

  const handlePublish = async (id: number, title: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success(`"${title}" published successfully`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish failed';
      toast.error(msg);
    }
  };

  const handleUnpublish = async (id: number, title: string) => {
    try {
      await unpublishMutation.mutateAsync(id);
      toast.success(`"${title}" reverted to draft`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Revert failed';
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted successfully`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      toast.error(msg);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (error) {
    return (
      <div className="glass-effect p-8 rounded-2xl text-center text-rose-400">
        Error loading articles list: {error.message}
      </div>
    );
  }

  // Client-side search filtering
  const filteredArticles = (articles || []).filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Articles</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your platform content and publish logs
          </p>
        </div>
        <Link
          to="/articles/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover-glow transition-all duration-200"
        >
          <span>Create Article</span>
        </Link>
      </div>

      {/* Filters & Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-4 border border-[var(--color-border-dark)] rounded-2xl">
        {/* Category Tabs */}
        <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-[var(--color-border-dark)]">
          {(['all', 'draft', 'published'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-slate-800 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search input field */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-[var(--color-border-dark)] rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="glass-effect rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border-dark)]">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 space-y-4">
            <span className="h-8 w-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin inline-block" />
            <p className="text-sm">Fetching articles data...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="inline-flex p-4 bg-slate-800/50 rounded-full text-slate-500">
              <SlidersHorizontal size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-300">No articles found</h3>
              <p className="text-sm text-slate-500">
                {searchQuery
                  ? 'Try refining your search keyword query.'
                  : 'Get started by creating your first article.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-dark)] bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Article Title
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-dark)]">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1 max-w-md">
                        <Link
                          to={`/articles/edit/${article.id}`}
                          className="font-semibold text-slate-200 hover:text-purple-400 transition-colors line-clamp-1 text-sm"
                        >
                          {article.title}
                        </Link>
                        <p className="text-xs text-slate-500 font-mono line-clamp-1">
                          /{article.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(article.createdAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Publish/Unpublish Toggle */}
                        {article.status === 'draft' ? (
                          <button
                            onClick={() => handlePublish(article.id, article.title)}
                            disabled={publishMutation.isPending}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/30 transition-colors"
                            title="Publish Article"
                          >
                            <Globe size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublish(article.id, article.title)}
                            disabled={unpublishMutation.isPending}
                            className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-950/30 transition-colors"
                            title="Revert to Draft"
                          >
                            <FileX size={16} />
                          </button>
                        )}

                        {/* Edit Button */}
                        <Link
                          to={`/articles/edit/${article.id}`}
                          className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-950/30 transition-colors inline-block"
                          title="Edit Article"
                        >
                          <Edit2 size={16} />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteTarget(article)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          articleTitle={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
export default ArticlesListPage;
