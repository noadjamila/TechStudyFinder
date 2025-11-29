import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Quiz_L2 from "./pages/QuizPage_L2";
import ResultsPage from "./pages/ResultsPage";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found in the DOM.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz/level/2" element={<Quiz_L2 />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        // eslint-disable-next-line no-console
        console.log("Service worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}
