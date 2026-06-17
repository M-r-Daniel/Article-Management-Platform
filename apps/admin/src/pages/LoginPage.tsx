import { BookOpen, Lock, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '../lib/api';
import { setToken } from '../lib/auth';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Centered LoginPage layout. Features glassmorphism card, HSL colors,
 * Lucide icons, loading states, and Zod validator.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side Zod validation
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<{ token: string }>('/api/admin/auth/login', {
        username,
        password,
      });

      setToken(response.token);
      toast.success('Successfully authenticated');
      navigate('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic blurred glow backing */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl filter -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl filter -z-10" />

      {/* Login Card */}
      <div className="max-w-md w-full glass-effect p-8 rounded-3xl space-y-8 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-purple-500/10 text-purple-400 rounded-2xl mb-2">
            <BookOpen size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Welcome Back</h1>
          <p className="text-sm text-slate-400">Sign in to manage your articles platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <User size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 bg-slate-900/60 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 ${
                  errors.username ? 'border-rose-500/60' : 'border-[var(--color-border-dark)]'
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-rose-400 font-medium">{errors.username}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 bg-slate-900/60 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 ${
                  errors.password ? 'border-rose-500/60' : 'border-[var(--color-border-dark)]'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold gradient-bg text-white hover-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
