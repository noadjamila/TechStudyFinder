import { Router, Request, Response } from "express";
import { handleDeployWebhook } from "../services/deployment.service";

const deployRouter = Router();

deployRouter.post("/webhook", async (req: Request, res: Response) => {
  try {
    await handleDeployWebhook(req, res);
  } catch (error) {
    console.error("Error handling deploy webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default deployRouter;
