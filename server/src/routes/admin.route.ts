import { Router } from "express";
import {
  uploadData,
  uploadMiddleware,
  handleMulterError,
} from "../controllers/admin.controller";

export const adminRouter = Router();

/**
 * Route to handle XML file uploads for database initialization.
 */
adminRouter.post(
  "/upload-data",
  uploadMiddleware,
  handleMulterError,
  uploadData,
);

export default adminRouter;
