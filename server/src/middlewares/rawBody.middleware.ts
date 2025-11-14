import { RawBodyRequest } from "../types/deployment.types";

/*
 * Returns the raw body previously captured and attached to the request object.
 */
export const getRawBody = (req: RawBodyRequest): Buffer => req.rawBody;
