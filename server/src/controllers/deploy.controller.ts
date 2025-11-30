import { NextFunction, Request, Response } from "express";
import { verifySignature } from "../services/deployment.service";
import { runDeploymentScript } from "../services/deployment.utils";

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawBody = req.body as Buffer;

    if (!rawBody || !Buffer.isBuffer(rawBody)) {
      return res
        .status(400)
        .json({ error: "Missing raw body for verification" });
    }

    const signature = req.headers["x-hub-signature-256"];
    if (!signature) {
      return res.status(400).json({ error: "Missing signature" });
    }

    const event = req.headers["x-github-event"];
    if (event !== "push") {
      return res.status(200).json({ message: "No deployment needed" });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({
        error: "Server misconfiguration: GITHUB_WEBHOOK_SECRET is not set",
      });
    }

    const isValid = verifySignature(secret, rawBody, signature as string);

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const jsonString = rawBody.toString("utf-8");
    const payload = JSON.parse(jsonString);

    if (!payload || !payload.ref) {
      return res.status(400).json({
        error: "Malformed payload: missing or invalid 'ref'",
      });
    }

    if (payload.ref !== "refs/heads/main") {
      return res.status(200).json({ message: "No deployment needed" });
    }

    runDeploymentScript()
      // eslint-disable-next-line no-console
      .then(() => console.log("Deployment finished"))
      .catch((e) => console.error("Deployment error:", e));

    return res.status(200).json({ message: "Deployment started" });
  } catch (err) {
    next(err);
  }
};
