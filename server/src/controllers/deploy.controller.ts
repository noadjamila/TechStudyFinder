import { Request, Response, NextFunction } from "express";
import { RawBodyRequest } from "../types/deployment.types";
import { verifySignature } from "../services/deployment.service";
import { runDeploymentScript } from "../services/deployment.utils";

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawReq = req as RawBodyRequest;

    const rawBody = rawReq.rawBody;
    if (!rawBody) {
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
      return res.status(200).json({ message: "Event ignored" });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Server misconfiguration: GITHUB_WEBHOOK_SECRET is not set" });
    }

    const isValid = verifySignature(
      secret,
      rawBody,
      signature as string,
    );

    if (!isValid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload = req.body;

    if (!payload || !payload.ref) {
      return res.status(400).json({
        error: "Malformed payload: missing or invalid 'ref'",
      });
    }

    if (payload.ref !== "refs/heads/main") {
      return res.status(200).json({ message: "No deployment needed" });
    }

    await runDeploymentScript();

    return res.status(200).json({ message: "Deployment finished" });
  } catch (err) {
    next(err);
  }
};
