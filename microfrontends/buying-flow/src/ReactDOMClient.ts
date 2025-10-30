// Custom ReactDOMClient wrapper to resolve bare specifier issues with React 19.2.0
// This wrapper handles both standalone and host app modes

import * as ReactDOMClientModule from 'react-dom/client';

function getGlobalReactDOM() {
  // First check if we have ReactDOM globally (host app mode)
  const globalReactDOM = (window as any).ReactDOMClient || (window as any).ReactDOM;
  
  if (globalReactDOM) {
    return globalReactDOM;
  }
  
  // If not global, use the imported module (standalone mode)
  if (ReactDOMClientModule) {
    // Make it available globally for consistency
    (window as any).ReactDOM = ReactDOMClientModule;
    return ReactDOMClientModule;
  }
  
  throw new Error('ReactDOM not found. Unable to initialize React rendering.');
}

function createRoot(container: Element | DocumentFragment, options?: any) {
  const ReactDOM = getGlobalReactDOM();
  
  if (process.env.NODE_ENV === 'production') {
    return ReactDOM.createRoot(container, options);
  } else {
    // For development, handle React's internal checks
    const internals = ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    
    if (internals) {
      internals.usingClientEntryPoint = true;
    }
    try {
      return ReactDOM.createRoot(container, options);
    } finally {
      if (internals) {
        internals.usingClientEntryPoint = false;
      }
    }
  }
}

function hydrateRoot(container: Element | DocumentFragment, initialChildren: any, options?: any) {
  const ReactDOM = getGlobalReactDOM();
  
  if (process.env.NODE_ENV === 'production') {
    return ReactDOM.hydrateRoot(container, initialChildren, options);
  } else {
    // For development, handle React's internal checks
    const internals = ReactDOM.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    
    if (internals) {
      internals.usingClientEntryPoint = true;
    }
    try {
      return ReactDOM.hydrateRoot(container, initialChildren, options);
    } finally {
      if (internals) {
        internals.usingClientEntryPoint = false;
      }
    }
  }
}

export { createRoot, hydrateRoot };
export default { createRoot, hydrateRoot };
