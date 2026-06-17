import { AlertOctagon, RotateCcw } from 'lucide-react';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary component to catch layout crashes and present
 * a beautiful, premium recovery UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside Admin Dashboard UI:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-effect p-8 rounded-3xl text-center space-y-6">
            <div className="inline-flex p-4 bg-rose-500/10 text-rose-500 rounded-full">
              <AlertOctagon size={40} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-100">Something went wrong</h1>
              <p className="text-sm text-slate-400">
                An unexpected error occurred in the application rendering.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-900/60 border border-[var(--color-border-dark)] p-4 rounded-xl text-left overflow-x-auto max-h-40">
                <pre className="text-xs font-mono text-rose-400">
                  {this.state.error.name}: {this.state.error.message}
                </pre>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium gradient-bg text-white hover-glow transition-all duration-200"
            >
              <RotateCcw size={16} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
