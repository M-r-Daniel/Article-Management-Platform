import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

/**
 * Public 404 fallback page. Renders glassmorphism card and navigation link.
 */
export function NotFoundPage() {
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl text-center space-y-6">
        <div className="inline-flex p-4 bg-blue-500/10 text-blue-400 rounded-full">
          <AlertCircle size={40} />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-100">Page Not Found</h1>
          <p className="text-sm text-slate-400">
            The article or page you are looking for does not exist or has been removed.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold gradient-bg text-white hover-glow transition-all"
          >
            <ArrowLeft size={16} />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default NotFoundPage;
