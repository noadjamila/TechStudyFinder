const express = require("express");
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Test-Route
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hallo vom Backend!" });
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route nicht gefunden" });
});

// Error Handler
app.use((err, _req, res, _next) => {
  console.error("Server-Fehler:", err);
  res.status(500).json({ error: "Interner Server-Fehler" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});

// Fehler-Behandlung für den Server selbst
process.on("uncaughtException", (error) => {
  console.error("Uncatchte Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

