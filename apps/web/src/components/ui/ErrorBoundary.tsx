import { AlertCircle, RotateCcw } from 'lucide-react';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Public Error Boundary container. Shows crash panels with reload buttons.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Public app crash:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-bg-dark)] flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl text-center space-y-6">
            <div className="inline-flex p-4 bg-blue-500/10 text-blue-400 rounded-full">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-100">Something went wrong</h1>
              <p className="text-sm text-slate-400">
                Failed to load this section. Try reloading the homepage.
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <RotateCcw size={16} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
