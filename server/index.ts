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
import quizRoutes from "./src/routes/quiz.route";
import { pool } from "./db";
import "express-async-errors";
import authRouter from "./src/routes/auth.route";
import session from "express-session";

const isTesting =
  process.env.NODE_ENV === "test" || !!process.env.JEST_WORKER_ID;

// Ensure SESSION_SECRET is set
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required for session handling");
}

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
const clientDistPath =
  process.env.CLIENT_DIST_PATH ||
  path.join(__dirname, "..", "..", "client", "dist");

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

// Standard JSON parsing middleware
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// API routes
app.use("/api", testRouter);
app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRouter);

// Test DB route
app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows?.[0]?.now });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 404 handler
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Serve static files from the frontend
app.use(express.static(clientDistPath));

// SPA fallback
// This handler only serves index.html for HTML navigation requests.
// API routes never reach this point because /api routes and the /api 404
// handler are registered earlier in the middleware chain.
app.get("*", (req, res, next) => {
  if (!req.accepts("html")) {
    return next();
  }

  res.sendFile(path.join(clientDistPath, "index.html"));
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
