import { BookOpen, FileText, LayoutDashboard, LogOut, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { logout } from '../../lib/auth';

/**
 * Sidebar navigation component for the Admin Dashboard.
 * Displays navigation items with active links and user logout options.
 */
export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/articles', label: 'Articles', icon: FileText },
    { to: '/articles/create', label: 'New Article', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 h-screen glass-effect border-r border-[var(--color-border-dark)] flex flex-col fixed top-0 left-0 z-20">
      {/* Branding Header */}
      <div className="p-6 border-b border-[var(--color-border-dark)] flex items-center gap-3">
        <div className="gradient-bg p-2 rounded-lg text-white">
          <BookOpen size={20} />
        </div>
        <div>
          <h1 className="font-semibold text-lg leading-none gradient-text">Publisher</h1>
          <span className="text-xs text-slate-500 font-medium">Admin Portal</span>
        </div>
      </div>

      {/* Navigation Menu Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === '/'
              ? currentPath === '/'
              : item.to === '/articles/create'
                ? currentPath === '/articles/create'
                : currentPath === '/articles' || currentPath.startsWith('/articles/edit/');

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'gradient-bg text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[var(--color-border-dark)]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
