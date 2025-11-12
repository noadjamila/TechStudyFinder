import { Request } from "express";

/*
 * Intercept incoming HTTP requests to capture the raw body
 */
export interface RawBodyRequest extends Request {
  rawBody: Buffer;
}

export const getRawBody = (req: RawBodyRequest): Buffer => req.rawBody;
