import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import "./index.css";
import App from "./App";
import Quiz_L2 from "./pages/QuizPage_L2";
import Quiz_L1 from "./pages/QuizPage_L1";
import theme from "./theme/theme";
import { registerSW } from "virtual:pwa-register";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found in the DOM.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/quiz/level/1" element={<Quiz_L1 />} />
          <Route path="/quiz/level/2" element={<Quiz_L2 />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);

// Register Vite PWA Service Worker
registerSW({
  onNeedRefresh() {
    // eslint-disable-next-line no-console
    console.log("New content available; please refresh.");
  },
  onOfflineReady() {
    // eslint-disable-next-line no-console
    console.log("App ready to work offline.");
  },
});
