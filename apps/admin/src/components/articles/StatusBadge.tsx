interface StatusBadgeProps {
  status: 'draft' | 'published';
}

/**
 * Status Badge indicator. Displays colored state pills for articles.
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      Draft
    </span>
  );
}
export default StatusBadge;
