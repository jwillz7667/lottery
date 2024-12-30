import React, { Component, ErrorInfo } from 'react';
import { Button } from './Button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
            <div className="mx-auto max-w-max">
              <main className="sm:flex">
                <p className="text-4xl font-bold tracking-tight text-indigo-600 sm:text-5xl">
                  Oops!
                </p>
                <div className="sm:ml-6">
                  <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                      Something went wrong
                    </h1>
                    <p className="mt-1 text-base text-gray-500">
                      {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                  </div>
                  <div className="mt-6 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                    <Button onClick={this.handleReset}>Try again</Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Reload page
                    </Button>
                  </div>
                </div>
              </main>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
} 