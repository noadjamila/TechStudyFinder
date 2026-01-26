import * as favoritesRepository from "../repositories/favorites.repository";

/**
 * Adds a study programme to the user's favorites
 * @param userId the ID of the user
 * @param studiengangId the ID of the study programme
 * @returns the created favorite record
 * @throws {Error} if the database operation fails
 */
export async function addFavorite(
  userId: number,
  studiengangId: string,
): Promise<{ id: number; user_id: number; studiengang_id: string }> {
  try {
    const result = await favoritesRepository.addFavorite(userId, studiengangId);
    console.log(
      `[FAVORITES] Added studiengang ${studiengangId} to favorites for user ${userId}`,
    );
    return result;
  } catch (err) {
    console.error("[SERVICE ERROR] Failed to add favorite:", err);
    throw err;
  }
}

/**
 * Removes a study programme from the user's favorites
 * @param userId the ID of the user
 * @param studiengangId the ID of the study programme
 * @returns the number of rows deleted
 * @throws {Error} if the database operation fails
 */
export async function removeFavorite(
  userId: number,
  studiengangId: string,
): Promise<number> {
  try {
    const deleted = await favoritesRepository.removeFavorite(
      userId,
      studiengangId,
    );
    console.log(
      `[FAVORITES] Removed studiengang ${studiengangId} from favorites for user ${userId}`,
    );
    return deleted;
  } catch (err) {
    console.error("[SERVICE ERROR] Failed to remove favorite:", err);
    throw err;
  }
}

/**
 * Gets all favorites for a user
 * @param userId the ID of the user
 * @returns array of favorite study programme IDs
 * @throws {Error} if the database operation fails
 */
export async function getFavorites(userId: number): Promise<string[]> {
  try {
    return await favoritesRepository.getUserFavorites(userId);
  } catch (err) {
    console.error("[SERVICE ERROR] Failed to get favorites:", err);
    throw err;
  }
}
