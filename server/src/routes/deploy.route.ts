import express, { Router } from "express";
import { handleWebhook } from "../controllers/deploy.controller";
import {
  globalWebhookRateLimiter,
  webhookRateLimiter,
} from "../middlewares/rate-limiter.middleware";

const deployRouter = Router();

/**
 * POST /deploy/webhook
 * Endpoint to handle deployment webhooks.
 * Protected by rate limiting middleware.
 * Expects raw body for signature verification.
 * Calls the handleWebhook controller to process the request.
 * Returns appropriate HTTP responses based on the outcome.
 */
deployRouter.post(
  "/webhook",
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  }),
  webhookRateLimiter,
  globalWebhookRateLimiter,
  handleWebhook,
);

export default deployRouter;
