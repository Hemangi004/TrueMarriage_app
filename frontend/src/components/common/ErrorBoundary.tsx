import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  recoveryAttempts: number;
  showDetails: boolean;
  isRecovering: boolean;
}

// Determines if an error is an external DOM mutation error (from Google Translate, Edge Translate, or browser extensions)
function isExternalDomMutationError(err: Error | null): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const name = (err.name || '').toLowerCase();

  return (
    msg.includes('removechild') ||
    msg.includes('insertbefore') ||
    msg.includes('replacechild') ||
    msg.includes('appendchild') ||
    msg.includes('not a child of this node') ||
    msg.includes('the node to be removed') ||
    msg.includes('the object can not be found here') ||
    msg.includes('hierarchyrequesterror') ||
    msg.includes('notfounderror') ||
    name === 'notfounderror' ||
    name === 'hierarchyrequesterror'
  );
}

export class ErrorBoundary extends Component<Props, State> {
  private recoveryTimer: ReturnType<typeof setTimeout> | null = null;
  private lastErrorTime: number = 0;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    recoveryAttempts: 0,
    showDetails: true,
    isRecovering: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });

    const now = Date.now();
    const isDomError = isExternalDomMutationError(error);

    // If it's a DOM mutation error from translation/extension, auto-recover up to 4 times
    if (isDomError && (this.state.recoveryAttempts < 4 || now - this.lastErrorTime > 4000)) {
      this.lastErrorTime = now;
      this.setState({ isRecovering: true });

      if (this.recoveryTimer) clearTimeout(this.recoveryTimer);

      this.recoveryTimer = setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          error: null,
          errorInfo: null,
          isRecovering: false,
          recoveryAttempts: prev.recoveryAttempts + 1,
        }));
      }, 60);
    }
  }

  public componentWillUnmount() {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
  }

  private handleReload = () => {
    try {
      // Clear transient non-essential storage keys that might be corrupt
      sessionStorage.removeItem('tm_post_login_redirect');
      sessionStorage.removeItem('tm_cached_discover_profiles');
    } catch {}
    window.location.reload();
  };

  private handleClearAndReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  private handleGoHome = () => {
    try {
      sessionStorage.removeItem('tm_post_login_redirect');
    } catch {}
    window.location.href = '/';
  };

  private handleToggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      // If we are auto-recovering from a DOM mutation error, show a brief elegant transition
      if (this.state.isRecovering) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
            <div className="w-8 h-8 border-3 border-[#F01472] border-t-transparent rounded-full animate-spin" />
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-rose-50/30 to-purple-50/20 p-4 sm:p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100/80 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#F01472] flex items-center justify-center mx-auto shadow-inner ring-4 ring-rose-50/50">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Something went wrong</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                A temporary display issue occurred. Refreshing the page or returning home will restore your session.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="py-3 px-4 bg-gradient-to-r from-[#F01472] to-[#C80E5A] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/25 cursor-pointer flex items-center justify-center gap-2 transition active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Home size={14} />
                <span>Go to Home</span>
              </button>
            </div>

            <button
              type="button"
              onClick={this.handleClearAndReset}
              className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition active:scale-95 cursor-pointer"
            >
              Clear Cached Data & Reset App
            </button>

            {/* Collapsible Error Diagnostics */}
            {this.state.error && (
              <div className="pt-2 text-left border-t border-slate-100">
                <button
                  type="button"
                  onClick={this.handleToggleDetails}
                  className="flex items-center justify-between w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span>Technical details</span>
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {this.state.showDetails && (
                  <pre className="mt-2 p-3 bg-slate-900 text-rose-300 text-[10px] font-mono rounded-xl overflow-auto max-h-48 whitespace-pre-wrap leading-relaxed select-text">
                    {this.state.error.toString()}\n\n
                    {this.state.error.stack || 'No stack trace available'}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}



