import { Router } from "express";
import { handleWebhook } from "../controllers/deploy.controller";

const deployRouter = Router();

deployRouter.post("/webhook", handleWebhook);

export default deployRouter;
