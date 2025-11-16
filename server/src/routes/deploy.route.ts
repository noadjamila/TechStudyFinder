import rateLimit from "express-rate-limit";
import { Router } from "express";
import { handleWebhook } from "../controllers/deploy.controller";
import { RawBodyRequest } from "../types/deployment.types";
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
  webhookRateLimiter,
  globalWebhookRateLimiter,
  (req, res, next) => {
    handleWebhook(req as RawBodyRequest, res, next);
  },
);

export default deployRouter;
