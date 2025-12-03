import rateLimit from "express-rate-limit";

/**
 * Rate limiter middleware for deployment webhook endpoint.
 * Limits to 5 requests per 5 minutes per IP address.
 * This helps prevent abuse of the deployment endpoint such as DoS attacks.
 */
const webhookRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5, // max 5 deployments per windowMs
  message: "Too many deployment requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export { webhookRateLimiter };
