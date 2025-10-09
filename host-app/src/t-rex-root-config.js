import { registerApplication, start } from 'single-spa';

// Error handling for microfrontend loading
function handleMicrofrontendError(error) {
  console.error('Microfrontend loading error:', error);
  const container = document.getElementById('microfrontend-container');
  if (container) {
    container.innerHTML = `
      <div class="error">
        <h3>Application Loading Error</h3>
        <p>Failed to load the buying flow application. Please try refreshing the page.</p>
        <details>
          <summary>Technical Details</summary>
          <pre>${error.message || error}</pre>
        </details>
      </div>
    `;
  }
}

// Register the buying flow microfrontend
registerApplication({
  name: '@t-rex/buying-flow',
  app: () => {
    return System.import('@t-rex/buying-flow').catch(error => {
      handleMicrofrontendError(error);
      // Return a minimal lifecycle to prevent single-spa errors
      return {
        bootstrap: () => Promise.resolve(),
        mount: () => Promise.resolve(),
        unmount: () => Promise.resolve(),
      };
    });
  },
  activeWhen: ['/'],
  customProps: {
    domElement: document.getElementById('microfrontend-container'),
    apiBaseUrl: 'http://localhost:8080/api',
  },
});

// Global error handler for single-spa
window.addEventListener('single-spa:routing-event', (event) => {
  console.log('Single-SPA routing event:', event.detail);
});

window.addEventListener('single-spa:app-change', (event) => {
  console.log('Single-SPA app change:', event.detail);
});

// Start single-spa
start({
  urlRerouteOnly: true,
});

console.log('T-Rex root config loaded successfully');

// Development helpers
if (process.env.NODE_ENV === 'development') {
  window.singleSpa = {
    getAppNames: () => window.System.resolve('@t-rex/buying-flow'),
    getAppStatus: (name) => window.singleSpa.getAppStatus(name),
  };
}
