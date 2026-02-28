
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

async function enableMocking() {
  try {
    const { worker } = await import('./mocks/browser')

    // Safety check for base URL
    const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
    // Use the VitePWA service worker in production to ensure MSW and Workbox coexist
    const swUrl = import.meta.env.PROD ? `${baseUrl}/sw.js` : `${baseUrl}/mockServiceWorker.js`

    console.log('[MSW] Initializing with SW:', swUrl)

    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: swUrl,
      },
    })
  } catch (err) {
    console.error('[MSW] Critical initialization error:', err)
  }
}

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

// Force render even if mocking fails or takes too long
enableMocking().finally(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});