import { Router } from "express";
import {
  uploadData,
  uploadMiddleware,
  handleMulterError,
  getRiasecData,
  editRiasecData,
} from "../controllers/admin.controller";

export const adminRouter = Router();

adminRouter.post(
  "/upload-data",
  uploadMiddleware,
  handleMulterError,
  uploadData,
);

adminRouter.get("/riasec-data", getRiasecData);

adminRouter.put("/edit-riasec-data", editRiasecData);

export default adminRouter;
