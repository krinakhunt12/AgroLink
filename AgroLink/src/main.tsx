
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import ErrorBoundary from './components/ErrorBoundary';
import { Providers } from './components/providers/Providers';
import "./index.css"

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>
);
