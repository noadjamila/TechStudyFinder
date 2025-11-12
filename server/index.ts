import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import "dotenv/config";
import path from "path";
import testRouter from "./src/routes/health.route";
import deployRouter from "./src/routes/deploy.route";

const app = express();

app.use(
  express.json({
    verify: (req, res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Routers
app.use("/api", testRouter);
app.use("/deploy", deployRouter);

// Fallback route for SPA
app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route nicht gefunden" });
});

// Error Handler
app.use(((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  const statusCode = (err as any).status || 500;
  res.status(statusCode).json({
    error: "Interner Server-Fehler",
    message: err.message,
  });
}) as ErrorRequestHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Error handling for the server
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
