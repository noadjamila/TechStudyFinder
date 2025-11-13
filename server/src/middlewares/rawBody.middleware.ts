import { RawBodyRequest } from "../types/deployment.types";

/*
 * Intercept incoming HTTP requests to capture the raw body
 */
export const getRawBody = (req: RawBodyRequest): Buffer => req.rawBody;
