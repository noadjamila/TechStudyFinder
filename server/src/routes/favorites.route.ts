import { Router } from "express";
import * as favoritesController from "../controllers/favorites.controller";

/**
 * Favorites routes for managing user's favorite study programmes
 * All routes require authentication (checked in controller)
 * Base path: /api/users/favorites
 */
const router = Router();

/**
 * POST /api/users/favorites
 * Add a study programme to the user's favorites
 * Body: { studiengangId: string }
 */
router.post("/", favoritesController.addFavorite);

/**
 * GET /api/users/favorites
 * Retrieve a user's favorite study programmes
 */
router.get("/", favoritesController.getFavorites);

/**
 * DELETE /api/users/favorites/:programmeId
 * Remove a study programme from a user's list of favorites
 */
router.delete("/:programmeId", favoritesController.removeFavorite);

export default router;
