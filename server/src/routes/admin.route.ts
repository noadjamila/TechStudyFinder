import { Router } from "express";
import { uploadData, uploadMiddleware } from "../controllers/admin.controller";

export const adminRouter = Router();

adminRouter.post("/upload-data", uploadMiddleware, uploadData);

export default adminRouter;
