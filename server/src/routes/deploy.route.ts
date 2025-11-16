import { Router } from "express";
import { handleWebhook } from "../controllers/deploy.controller";
import { RawBodyRequest } from "../types/deployment.types";

const deployRouter = Router();

deployRouter.post("/webhook", (req, res, next) => {
  handleWebhook(req as RawBodyRequest, res, next);
});

export default deployRouter;
