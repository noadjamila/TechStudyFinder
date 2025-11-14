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
import { pool } from "./db";
import "express-async-errors";

const app = express();
const PORT = process.env.PORT || 5001;

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

// Test api for data base call
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

// Error handling for the server
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

let server: import("http").Server | null = null;

if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
export { server, pool };
