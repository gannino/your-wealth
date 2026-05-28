import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface flex items-center justify-center px-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 max-w-md">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-4">
              An error occurred while rendering this page. This might be due to corrupted
              stored data.
            </p>
            {this.state.error && (
              <div className="bg-dark-bg border border-dark-border rounded p-4 mb-6">
                <p className="text-red-400 text-sm font-mono">{this.state.error.message}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-primary-teal hover:bg-primary-teal/90 text-white py-2 px-4 rounded-lg"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  // Clear all Your Wealth data
                  const keys = Object.keys(localStorage);
                  keys.forEach((key) => {
                    if (key.startsWith('your-wealth-')) {
                      localStorage.removeItem(key);
                    }
                  });
                  window.location.reload();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
