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
    return res.status(401).json({ error: "Unauthorized" });
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
 * Check the GitHub webhook signature
 * @param signature The signature from the webhook header 'x-hub-signature-256'
 * @param rawBody The raw request body
 * @returns boolean indicating if the signature is valid
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

  const calculatedHashBuffer = Buffer.from(calculatedHash, "hex");
  const githubHashBuffer = Buffer.from(githubHash, "hex");

  if (calculatedHashBuffer.length !== githubHashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(calculatedHashBuffer, githubHashBuffer);
};
