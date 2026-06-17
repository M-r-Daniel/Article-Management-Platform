import { BookOpen, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';

/**
 * Public header navbar. Includes sticky glassmorphism overlay, brand logo,
 * link indicators, and admin panel portal button.
 */
export function Header() {
  const [isGhostTheme, setIsGhostTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        document.documentElement.classList.contains('theme-ghost') ||
        localStorage.getItem('theme') === 'ghost'
      );
    }
    return false;
  });

  useEffect(() => {
    if (isGhostTheme) {
      document.documentElement.classList.add('theme-ghost');
      localStorage.setItem('theme', 'ghost');
    } else {
      document.documentElement.classList.remove('theme-ghost');
      localStorage.setItem('theme', 'dark');
    }
  }, [isGhostTheme]);

  return (
    <header className="sticky top-0 left-0 w-full z-40 glass-panel border-b border-[var(--color-border-dark)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Branding Title */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-100">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <BookOpen size={18} />
          </div>
          <span className="gradient-brand text-glow font-bold">Publisher</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            Articles
          </NavLink>
        </nav>

        {/* Portal link to admin & theme toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsGhostTheme(!isGhostTheme)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-xs font-semibold ${
              isGhostTheme
                ? 'bg-slate-900 text-amber-400 border-amber-500/30 hover:bg-slate-800'
                : 'bg-slate-900 border-[var(--color-border-dark)] text-indigo-400 hover:bg-slate-800'
            }`}
            title="Toggle Light/Dark Theme"
          >
            {isGhostTheme ? (
              <>
                <Sun size={14} className="text-amber-500" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-indigo-400" />
                <span>Dark</span>
              </>
            )}
          </button>

          <a
            href="http://localhost:5173"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-[var(--color-border-dark)] text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard size={14} />
            <span>Admin Portal</span>
          </a>
        </div>
      </div>
    </header>
  );
}
export default Header;
