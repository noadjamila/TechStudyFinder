/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Request, Response } from "express";
import * as favoritesService from "../services/favorites.service";

/**
 * Add a study programme to the user's favorites
 * POST /api/users/favorites
 * Body: { studiengangId: string }
 * Returns: { success: boolean, favorite: { id, user_id, studiengang_id }, message: string }
 */
export async function addFavorite(req: Request, res: Response) {
  try {
    const userId = (req.session as any)?.user?.id;
    const { studiengangId } = req.body;

    console.debug("[addFavorite] Session:", (req.session as any).user);
    console.debug("[addFavorite] userId:", userId);
    console.debug("[addFavorite] studiengangId:", studiengangId);

    // Validation
    if (!userId) {
      console.debug("[addFavorite] No userId in session, returning 401");
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!studiengangId) {
      return res.status(400).json({ error: "studiengangId is required" });
    }

    // Add favorite
    const favorite = await favoritesService.addFavorite(userId, studiengangId);

    return res.status(201).json({
      success: true,
      favorite,
      message: "Study programme added to favorites",
    });
  } catch (err: any) {
    console.error("[CONTROLLER ERROR] Failed to add favorite:", err);
    // Handle unique constraint violation
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Study programme is already in favorites",
      });
    }
    return res.status(500).json({
      error: err.message || "Failed to add favorite",
    });
  }
}

/**
 * Get all favorites for the authenticated user
 * GET /api/users/favorites
 * Returns: { success: boolean, favorites: string[] }
 */
export async function getFavorites(req: Request, res: Response) {
  try {
    const userId = (req.session as any)?.user?.id;

    // Validation
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get favorites
    const favorites = await favoritesService.getFavorites(userId);

    return res.status(200).json({
      success: true,
      favorites,
    });
  } catch (err: any) {
    console.error("[CONTROLLER ERROR] Failed to get favorites:", err);
    return res.status(500).json({
      error: err.message || "Failed to get favorites",
    });
  }
}

/**
 * Remove a study programme from the user's favorites
 * DELETE /api/users/favorites/:programmeId
 * Returns: { success: boolean, message: string }
 */
export async function removeFavorite(req: Request, res: Response) {
  try {
    const userId = (req.session as any)?.user?.id;
    const { programmeId } = req.params;

    // Validation
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!programmeId) {
      return res.status(400).json({ error: "programmeId is required" });
    }

    // Remove favorite
    const deleted = await favoritesService.removeFavorite(userId, programmeId);

    if (deleted === 0) {
      return res.status(404).json({
        error: "Favorite not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Study programme removed from favorites",
    });
  } catch (err: any) {
    console.error("[CONTROLLER ERROR] Failed to remove favorite:", err);
    return res.status(500).json({
      error: err.message || "Failed to remove favorite",
    });
  }
}
