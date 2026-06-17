import { createArticleSchema } from '@article-platform/shared';
import { Save } from 'lucide-react';
import { useState } from 'react';

interface ArticleFormProps {
  initialValues?: { title: string; summary: string; content: string };
  onSubmit: (values: { title: string; summary: string; content: string }) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

/**
 * Common Article Form. Validates title, summary, and content inputs
 * with Zod schema and maps field error blocks.
 */
export function ArticleForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [summary, setSummary] = useState(initialValues?.summary || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [errors, setErrors] = useState<{ title?: string; summary?: string; content?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side Zod validation
    const result = createArticleSchema.safeParse({ title, summary, content });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    await onSubmit({ title, summary, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 glass-effect p-8 rounded-3xl">
      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Article Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter article title..."
          disabled={isSubmitting}
          className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 ${
            errors.title ? 'border-rose-500/60' : 'border-[var(--color-border-dark)]'
          }`}
        />
        {errors.title && <p className="text-xs text-rose-400 font-medium">{errors.title}</p>}
      </div>

      {/* Summary Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Short Summary
        </label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief description of the article..."
          disabled={isSubmitting}
          className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 ${
            errors.summary ? 'border-rose-500/60' : 'border-[var(--color-border-dark)]'
          }`}
        />
        {errors.summary && <p className="text-xs text-rose-400 font-medium">{errors.summary}</p>}
      </div>

      {/* Content Textarea */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Body Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write the full content body here..."
          disabled={isSubmitting}
          rows={12}
          className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 resize-y font-normal leading-relaxed ${
            errors.content ? 'border-rose-500/60' : 'border-[var(--color-border-dark)]'
          }`}
        />
        {errors.content && <p className="text-xs text-rose-400 font-medium">{errors.content}</p>}
      </div>

      {/* Submit Controls */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold gradient-bg text-white hover-glow transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
export default ArticleForm;
