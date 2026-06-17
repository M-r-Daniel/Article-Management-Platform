import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArticleForm } from '../components/articles/ArticleForm';
import { useCreateArticle } from '../hooks/useArticles';

/**
 * Page container to create articles. Connects ArticleForm to create mutation.
 */
export function CreateArticlePage() {
  const navigate = useNavigate();
  const createMutation = useCreateArticle();

  const handleSubmit = async (values: { title: string; summary: string; content: string }) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success('Article created as draft successfully');
      navigate('/articles');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create article';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link Nav */}
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
        <h1 className="text-3xl font-bold text-slate-100">Create Article</h1>
        <p className="text-slate-400 text-sm mt-1">Compose a new article in draft state</p>
      </div>

      {/* Form wrapper */}
      <ArticleForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Save as Draft"
      />
    </div>
  );
}
export default CreateArticlePage;
