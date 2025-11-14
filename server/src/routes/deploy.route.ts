import { RequestHandler, Router } from "express";
import { handleWebhook } from "../controllers/deploy.controller";

const deployRouter = Router();

deployRouter.post("/webhook", handleWebhook as unknown as RequestHandler);

export default deployRouter;
