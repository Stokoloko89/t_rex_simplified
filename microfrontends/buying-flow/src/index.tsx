import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React: React,
  ReactDOMClient: ReactDOM,
  rootComponent: App,
  errorBoundary(err: Error, info: React.ErrorInfo, props: any) {
    console.error('Microfrontend Error:', err);
    return React.createElement('div', null, `Error in buying flow: ${err.message}`);
  },
});

export const { bootstrap, mount, unmount } = lifecycles;

// For standalone development
if (process.env.NODE_ENV === 'development' && !window.System) {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(React.createElement(App));
}
