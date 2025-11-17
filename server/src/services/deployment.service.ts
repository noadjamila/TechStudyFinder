import * as crypto from "crypto";
import { Buffer } from "buffer";
import { Request, Response } from "express";
import { runDeploymentScript } from "./deployment.utils";
import { getRawBody } from "../middlewares/rawBody.middleware";
import { RawBodyRequest } from "../types/deployment.types";

export const handleDeployWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const raw = getRawBody(req as RawBodyRequest);
  if (!raw) {
    console.error("Raw body missing (middleware misconfiguration?)");
    return res.status(400).json({ error: "Missing raw body" });
  }

  if (!signature) {
    console.warn("No signature provided in webhook request");
    return res.status(400).json({ error: "Missing signature" });
  }

  /*
   * Perform security check
   */
  if (!verifySignature(signature, raw)) {
    console.warn("Webhook signature verification failed");
    return res.status(401).json({ error: "Unauthorized" });
  }

  /*
   * Validate event type and branch
   */
  const githubEvent = req.headers["x-github-event"];

  if (
    !req.body ||
    typeof req.body !== "object" ||
    typeof req.body.ref !== "string"
  ) {
    console.warn("Malformed webhook payload: missing or invalid 'ref'");
    return res
      .status(400)
      .json({ error: "Malformed payload: missing or invalid 'ref'" });
  }

  const branch = req.body.ref;

  if (githubEvent !== "push" || branch !== "refs/heads/main") {
    return res.status(200).json({ message: "No deployment needed" });
  }

  try {
    await runDeploymentScript();
    res.status(200).json({ message: "Deployment finished" });
  } catch (error: any) {
    console.error("Deployment script failed:", error);
    res.status(500).json({ error: "Deployment failed" });
  }
};

/**
 * Verifies the GitHub webhook signature using HMAC SHA-256.
 * Uses timing-safe comparison to prevent timing attacks.
 * @param signature The signature from the webhook header 'x-hub-signature-256' (format: 'sha256=<hash>')
 * @param rawBody The raw request body as a Buffer
 * @returns boolean indicating if the signature is valid
 * @environment GITHUB_WEBHOOK_SECRET - Required secret for signature verification.
 * @security The security of this function depends on the secrecy and correctness of the GITHUB_WEBHOOK_SECRET environment variable.
 * If the secret is leaked or misconfigured, attackers may be able to forge webhook requests.
 */
export const verifySignature = (
  signature: string,
  rawBody: Buffer,
): boolean => {
  const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

  if (!GITHUB_WEBHOOK_SECRET) {
    console.error("[verifySignature] GITHUB_WEBHOOK_SECRET is missing");
    return false;
  }

  const [algorithm, githubHash] = signature.split("=");
  if (algorithm !== "sha256") {
    console.warn("[verifySignature] Unknown signature algorithm:", algorithm);
    return false;
  }

  const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
  hmac.update(rawBody);
  const calculatedHash = hmac.digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(calculatedHash, "utf8"),
    Buffer.from(githubHash, "utf8"),
  );
};
