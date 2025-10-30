import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

let root: any = null;

// Custom lifecycle functions for React 19 compatibility
export function bootstrap() {
  return Promise.resolve();
}

export function mount(props: any) {
  return new Promise<void>((resolve) => {
    const domElement = props.domElement || document.getElementById('microfrontend-container');
    if (domElement) {
      try {
        // Use ReactDOM directly
        root = ReactDOM.createRoot(domElement);
        root.render(React.createElement(App, props));
        resolve();
      } catch (error) {
        console.error('Error mounting microfrontend:', error);
        resolve();
      }
    } else {
      console.error('DOM element not found for mounting');
      resolve();
    }
  });
}

export function unmount() {
  return new Promise<void>((resolve) => {
    if (root) {
      try {
        root.unmount();
        root = null;
      } catch (error) {
        console.error('Error unmounting microfrontend:', error);
      }
    }
    resolve();
  });
}

// For standalone operation (both development and production)
// Check if running standalone (no Single-SPA host) by looking for root element
if (typeof window !== 'undefined' && document.getElementById('root')) {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.hasChildNodes()) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(App));
      console.log('T-Rex Buying Flow: Running in standalone mode');
    } catch (error) {
      console.error('Error initializing standalone mode:', error);
    }
  }
}
