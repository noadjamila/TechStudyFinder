import request from "supertest";
import express from "express";
import deployRouter from "../../routes/deploy.route";
import { runDeploymentScript } from "../deployment.utils";
import crypto from "crypto";

// Mock shell deployment
jest.mock("../../services/deployment.utils", () => ({
  runDeploymentScript: jest.fn().mockResolvedValue(undefined),
}));

// Mock rate limiters
jest.mock("../../middlewares/rate-limiter.middleware", () => ({
  webhookRateLimiter: (_req: any, _res: any, next: any) => next(),
  globalWebhookRateLimiter: (_req: any, _res: any, next: any) => next(),
}));

// Raw-body aware express app
const app = express();
app.use(
  "/deploy/webhook",
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  }),
);
app.use("/deploy", deployRouter);

// Signature helper
const generateSignature = (secret: string, body: string) => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(body);
  return `sha256=${hmac.digest("hex")}`;
};

describe("POST /deploy/webhook", () => {
  const SECRET = "testsecret";

  beforeAll(() => {
    process.env.GITHUB_WEBHOOK_SECRET = SECRET;
  });

  it("deploys correctly for valid signature", async () => {
    const payload = JSON.stringify({ ref: "refs/heads/main" });
    const signature = generateSignature(SECRET, payload);

    const res = await request(app)
      .post("/deploy/webhook")
      .set("Content-Type", "application/json")
      .set("x-hub-signature-256", signature)
      .set("x-github-event", "push")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Deployment finished" });
    expect(runDeploymentScript).toHaveBeenCalled();
  });

  it("returns 401 for invalid signature", async () => {
    const payload = JSON.stringify({ ref: "refs/heads/main" });

    const res = await request(app)
      .post("/deploy/webhook")
      .set("Content-Type", "application/json")
      .set("x-hub-signature-256", "sha256=invalid")
      .set("x-github-event", "push")
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 if signature missing", async () => {
    const payload = JSON.stringify({ ref: "refs/heads/main" });

    const res = await request(app)
      .post("/deploy/webhook")
      .set("Content-Type", "application/json")
      .set("x-github-event", "push")
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Missing signature" });
  });

  it("skips deployment for non-main branch", async () => {
    const payload = JSON.stringify({ ref: "refs/heads/dev" });
    const signature = generateSignature(SECRET, payload);

    const res = await request(app)
      .post("/deploy/webhook")
      .set("Content-Type", "application/json")
      .set("x-hub-signature-256", signature)
      .set("x-github-event", "push")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "No deployment needed" });
    expect(runDeploymentScript).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed payload", async () => {
    const payload = JSON.stringify({ foo: "bar" });
    const signature = generateSignature(SECRET, payload);

    const res = await request(app)
      .post("/deploy/webhook")
      .set("Content-Type", "application/json")
      .set("x-hub-signature-256", signature)
      .set("x-github-event", "push")
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "Malformed payload: missing or invalid 'ref'",
    });
  });
});
