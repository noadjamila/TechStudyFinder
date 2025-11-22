import * as crypto from "crypto";
import { Buffer } from "buffer";
import { Response } from "express";
import { runDeploymentScript } from "./deployment.utils";
import { RawBodyRequest } from "../types/deployment.types";

/**
 * Verifies the GitHub webhook signature using HMAC SHA-256.
 * Uses timing-safe comparison to prevent timing attacks.
 * @param secret The webhook secret configured in GitHub and the server
 * @param signature The signature from the webhook header 'x-hub-signature-256' (format: 'sha256=<hash>')
 * @param rawBody The raw request body as a Buffer
 * @returns boolean indicating if the signature is valid
 * @environment GITHUB_WEBHOOK_SECRET - Required secret for signature verification.
 * @security The security of this function depends on the secrecy and correctness of the GITHUB_WEBHOOK_SECRET environment variable.
 * If the secret is leaked or misconfigured, attackers may be able to forge webhook requests.
 */
export const verifySignature = (
  secret: string,
  rawBody: Buffer,
  signature: string,
): boolean => {
  if (!signature) {
    console.warn("[verifySignature] Missing signature");
    return false;
  }

  if (!secret) {
    console.error("[verifySignature] Missing webhook secret");
    return false;
  }

  if (!rawBody) {
    console.warn("[verifySignature] Missing raw body");
    return false;
  }

  const parts = signature.split("=");

  if (parts.length !== 2) {
    console.warn("[verifySignature] Invalid signature format");
    return false;
  }

  const [algorithm, githubHash] = parts;

  if (algorithm !== "sha256") {
    console.warn("[verifySignature] Unknown signature algorithm:", algorithm);
    return false;
  }

  try {
    // Compute expected HMAC
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const calculatedHash = hmac.digest("hex");

    const calculatedBuffer = Buffer.from(calculatedHash, "hex");
    const providedBuffer = Buffer.from(githubHash, "hex");

    // Length check required by timingSafeEqual
    if (calculatedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(calculatedBuffer, providedBuffer);
  } catch (err) {
    console.error("[verifySignature] Error comparing signatures:", err);
    return false;
  }
};

export const handleDeployWebhook = async (
  req: RawBodyRequest,
  res: Response,
) => {
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  const githubEvent = req.headers["x-github-event"];

  if (!signature) {
    return res.status(400).json({ error: "Missing signature" });
  }

  if (!req.rawBody) {
    return res.status(400).json({ error: "Missing raw body for verification" });
  }

  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[handleDeployWebhook] Missing GITHUB_WEBHOOK_SECRET");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  if (!verifySignature(secret, req.rawBody, signature)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (
    !req.body ||
    typeof req.body !== "object" ||
    typeof req.body.ref !== "string"
  ) {
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
    return res.status(200).json({ message: "Deployment finished" });
  } catch (err) {
    console.error("Deployment script failed:", err);
    return res.status(500).json({ error: "Deployment failed" });
  }
};
