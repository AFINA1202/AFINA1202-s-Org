import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan Aplikasi</h1>
            <p className="text-slate-700 mb-4">
              Mohon maaf, aplikasi mengalami kendala teknis.
            </p>
            <div className="bg-slate-100 p-4 rounded text-sm text-slate-800 font-mono break-words overflow-auto max-h-40">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              className="mt-6 w-full bg-emerald-600 text-white rounded py-2 hover:bg-emerald-700 transition"
              onClick={() => window.location.href = '/'}
            >
              Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
