import rateLimit from "express-rate-limit";
import { Router } from "express";
import { handleWebhook } from "../controllers/deploy.controller";
import { RawBodyRequest } from "../types/deployment.types";

const deployRouter = Router();

/**
 * Rate limiter middleware for deployment webhook endpoint.
 * Limits to 5 requests per minute per IP address.
 * This helps prevent abuse of the deployment endpoint such as DoS attacks.
 */
const webhookRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // limit each IP to 5 requests per windowMs
  message: "Too many deployment requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /deploy/webhook
 * Endpoint to handle deployment webhooks.
 * Protected by rate limiting middleware.
 * Expects raw body for signature verification.
 * Calls the handleWebhook controller to process the request.
 * Returns appropriate HTTP responses based on the outcome.
 */
deployRouter.post("/webhook", webhookRateLimiter, (req, res, next) => {
  handleWebhook(req as RawBodyRequest, res, next);
});

export default deployRouter;
