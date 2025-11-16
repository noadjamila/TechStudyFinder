import { RawBodyRequest } from "../types/deployment.types";

/*
 * Returns the raw body previously captured and attached to the request object.
 */
export const getRawBody = (req: RawBodyRequest): Buffer => {
  if (!req.rawBody) {
    throw new Error(
      "Raw body is missing from the request. Ensure the raw body middleware is configured correctly.",
    );
  }
  return req.rawBody;
};
