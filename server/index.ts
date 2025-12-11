import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import testRouter from "./src/routes/health.route";
import deployRouter from "./src/routes/deploy.route";
import quizRoutes from "./src/routes/quiz.route";
import { pool } from "./db";
import "express-async-errors";

const isTesting =
  process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;

// Safety check for webhook secret
if (!process.env.GITHUB_WEBHOOK_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: GITHUB_WEBHOOK_SECRET is not set");
    process.exit(1);
  } else if (!isTesting) {
    console.warn(
      "WARNING: Missing GITHUB_WEBHOOK_SECRET (dev/testing mode only).",
    );
  }
}

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5001;
const clientDistPath = path.join(__dirname, "..", "..", "client", "dist");

let server: import("http").Server | null = null;

// CORS configuration for development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
}

// Deployment route
app.use("/deploy", deployRouter);

// Standard JSON parsing middleware
app.use(express.json());

// API routes
app.use("/api", testRouter);
app.use("/api/quiz", quizRoutes);

// Test DB route
app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows?.[0]?.now });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve static files from the frontend
app.use(express.static(clientDistPath));

// SPA fallback
app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api/") || req.url.startsWith("/deploy")) {
    return next();
  }

  res.sendFile(path.join(clientDistPath, "index.html"));
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  const statusCode = (err as any).status || 500;
  res.status(statusCode).json({
    error: "Internal server error",
    message: err.message,
  });
}) as ErrorRequestHandler);

if (require.main === module) {
  server = app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "reason:", reason);
});

export { server, pool };
