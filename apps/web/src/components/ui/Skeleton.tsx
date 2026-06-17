/**
 * Skeleton loading blocks for card lists and page titles.
 */
export function SkeletonCard() {
  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4 animate-pulse">
      <div className="flex gap-4">
        <div className="h-4 w-24 bg-slate-800 rounded" />
        <div className="h-4 w-20 bg-slate-800 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-slate-800 rounded" />
        <div className="h-4 w-full bg-slate-800 rounded" />
        <div className="h-4 w-5/6 bg-slate-800 rounded" />
      </div>
      <div className="h-4 w-28 bg-slate-800 rounded pt-2" />
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-24 bg-slate-800 rounded" />
      <div className="space-y-3">
        <div className="h-10 w-2/3 bg-slate-800 rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-4 w-24 bg-slate-800 rounded" />
        </div>
      </div>
      <div className="h-64 bg-slate-800/50 rounded-2xl" />
    </div>
  );
}
export default SkeletonCard;
