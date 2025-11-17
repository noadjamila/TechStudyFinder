import rateLimit from "express-rate-limit";

/**
 * Rate limiter middleware for deployment webhook endpoint.
 * Limits to 5 requests 5 minutes per IP address.
 * This helps prevent abuse of the deployment endpoint such as DoS attacks.
 */
const webhookRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5, // max 5 deployments per windowMs
  message: "Too many deployment requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Global rate limiter middleware for deployment hook endpoint.
 * Limits to 3 requests per 5 minutes across all IP addresses.
 * This helps prevent distributed attacks, e.g. IP rotation.
 */
const globalWebhookRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 3, // max 3 deployments globally per windowMs
  keyGenerator: () => "global", // Use a constant key to apply limit globally
  message: "Too many global deployment requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export { webhookRateLimiter, globalWebhookRateLimiter };
