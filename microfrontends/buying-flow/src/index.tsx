import App from './App';
import ReactDOMClient from './ReactDOMClient';

// React is available globally from the host app
declare const React: typeof import('react');

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
        // Use the custom ReactDOMClient wrapper to avoid bare specifier issues
        root = ReactDOMClient.createRoot(domElement);
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

// For standalone development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.port === '3001') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // For standalone mode, use dynamic imports to avoid bundling issues
    Promise.all([
      import('react'),
      import('react-dom/client')
    ]).then(([ReactModule, ReactDOMClientModule]) => {
      // Make React available globally for standalone mode
      (window as any).React = ReactModule.default || ReactModule;
      (window as any).ReactDOM = ReactDOMClientModule;
      
      const root = ReactDOMClient.createRoot(rootElement);
      root.render(React.createElement(App));
    }).catch(console.error);
  }
}
