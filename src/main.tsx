import { createRoot } from "react-dom/client";
import { registerSW } from 'virtual:pwa-register';
import App from "./App.tsx";
import "./index.css";

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log('[PWA] New content available — refresh to update.');
    },
    onOfflineReady() {
      console.log('[PWA] App ready to work offline.');
    },
  });
}

createRoot(document.getElementById("root")!).render(<App />);
