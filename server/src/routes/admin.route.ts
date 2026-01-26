import { Router } from "express";
import {
  uploadData,
  uploadMiddleware,
  handleMulterError,
  getRiasecData,
  editRiasecData,
  login,
  logout,
  getAdmin,
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

adminRouter.post("/login", login);

adminRouter.post("/logout", logout);

adminRouter.get("/me", getAdmin);

export default adminRouter;
