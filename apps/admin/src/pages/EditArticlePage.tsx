import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { ArticleForm } from '../components/articles/ArticleForm';
import { useArticle, useUpdateArticle } from '../hooks/useArticles';

/**
 * Page container to edit articles. Retrieves details based on path params,
 * and feeds initial values to ArticleForm.
 */
export function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const articleId = Number(id);

  const { data: article, isLoading, error } = useArticle(articleId);
  const updateMutation = useUpdateArticle();

  const handleSubmit = async (values: { title: string; summary: string; content: string }) => {
    if (Number.isNaN(articleId)) return;
    try {
      await updateMutation.mutateAsync({
        id: articleId,
        input: values,
      });
      toast.success('Article updated successfully');
      navigate('/articles');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update article';
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-4 w-28 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-64 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-96 bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Articles</span>
          </Link>
        </div>
        <div className="glass-effect p-8 rounded-2xl text-center text-rose-400">
          {error ? `Error retrieving article: ${error.message}` : 'Article not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Edit Article</h1>
        <p className="text-slate-400 text-sm mt-1">
          Modify attributes for article:{' '}
          <span className="font-semibold text-slate-200">"{article.title}"</span>
        </p>
      </div>

      {/* Form wrapper */}
      <ArticleForm
        initialValues={{
          title: article.title,
          summary: article.summary,
          content: article.content,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
export default EditArticlePage;
