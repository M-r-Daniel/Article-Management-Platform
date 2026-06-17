interface ArticleGridProps {
  children: React.ReactNode;
}

/**
 * Responsive grid wrapper for public article list cards.
 */
export function ArticleGrid({ children }: ArticleGridProps) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>;
}
export default ArticleGrid;
