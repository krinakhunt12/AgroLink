
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import AppLogger from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Fixed inheritance by using React.Component to ensure props and state are correctly recognized by TypeScript
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    AppLogger.error('Uncaught error caught by ErrorBoundary:', { error, errorInfo });
  }

  private handleReset = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  // Added explicit return type ReactNode to render method to fix property access errors
  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-gray-100">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} className="text-amber-600" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-4">અરેરે! કંઈક ભૂલ થઈ છે.</h1>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              તકનીકી સમસ્યાને કારણે એપ્લિકેશન લોડ થઈ શકી નથી. કૃપા કરીને પેજ ફરીથી લોડ કરો અથવા હોમ પેજ પર જાઓ.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-green-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-800 transition shadow-lg"
              >
                <RefreshCw size={20} /> ફરીથી લોડ કરો
              </button>
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition"
              >
                <Home size={20} /> હોમ પેજ પર જાઓ
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Accessing children from props in a class component
    return this.props.children;
  }
}

export default ErrorBoundary;
