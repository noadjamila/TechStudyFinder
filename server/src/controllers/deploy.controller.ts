import { handleDeployWebhook } from "../services/deployment.service";
import { Response } from "express";
import { RawBodyRequest } from "../types/deployment.types";

export const handleWebhook = async (req: RawBodyRequest, res: Response) => {
  try {
    await handleDeployWebhook(req, res);
  } catch (error) {
    console.error("[handleWebhook] Error handling webhook:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Internal server error in the controller" });
    }
  }
};
