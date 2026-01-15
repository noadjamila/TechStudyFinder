import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";

import "./index.css";
import App from "./App";
import theme from "./theme/theme";
import { registerSW } from "virtual:pwa-register";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found in the DOM.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);

// Register Vite PWA Service Worker
registerSW({
  onNeedRefresh() {
    console.debug("New content available; please refresh.");
  },
  onOfflineReady() {
    console.debug("App ready to work offline.");
  },
});
