import { Request, Response, NextFunction } from "express";

/**
 * Ensures that req.rawBody exists (set earlier by express.json({ verify }))
 */
export const rawBodyMiddleware = (
  req: Request & { rawBody?: Buffer },
  res: Response,
  next: NextFunction,
) => {
  if (!req.rawBody) {
    return res.status(400).json({ error: "Missing raw body for verification" });
  }

  next();
};
