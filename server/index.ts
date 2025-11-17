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
import quizRoutes from "./src/routes/quiz.route";
import { pool } from "./db";
import "express-async-errors";

if (!process.env.GITHUB_WEBHOOK_SECRET) {
  console.error("FATAL: GITHUB_WEBHOOK_SECRET environment variable is not set");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

let server: import("http").Server | null = null;

// Standard JSON parsing for most routes
app.use(express.json());

// Raw body parsing for deployment webhook route
app.use(
  "/deploy/webhook",
  express.json({
    verify: (req, res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);

// Routers
app.use("/api", testRouter);
app.use("deploy", deployRouter);
app.use("/api/quiz", quizRoutes);

app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Test route
app.use("/api", testRouter);
app.use("/deploy", deployRouter);
app.use("/api/quiz", quizRoutes);

// Test api for database call
app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: (result.rows?.[0] as any)?.now });
  } catch (err: any) {
    console.error("Datenbankfehler:", err);
    res
      .status(500)
      .json({ success: false, error: err?.message || String(err) });
  }
});

// Fallback route for SPA
app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api/") || req.url.startsWith("/deploy")) {
    return next();
  }

  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
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

// Error handling for the server
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
export { server, pool };
