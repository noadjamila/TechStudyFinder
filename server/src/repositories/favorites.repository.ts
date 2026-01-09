import { pool } from "../../db";

/**
 * Adds a study programme to the user's favorites
 * @param userId the ID of the user
 * @param studiengangId the ID of the study programme
 * @returns the created favorite record
 * @throws {Error} if the query fails or the favorite already exists
 */
export async function addFavorite(
  userId: number,
  studiengangId: string,
): Promise<{ id: number; user_id: number; studiengang_id: string }> {
  const query = `
    INSERT INTO favoriten (user_id, studiengang_id)
    VALUES ($1, $2)
    RETURNING id, user_id, studiengang_id;
  `;

  try {
    const result = await pool.query(query, [userId, studiengangId]);
    return result.rows[0];
  } catch (err: any) {
    console.error(
      `[DB ERROR] Failed to add favorite for user ${userId} and studiengang ${studiengangId}:`,
      err.message,
    );
    throw err;
  }
}

/**
 * Removes a study programme from the user's favorites
 * @param userId the ID of the user
 * @param studiengangId the ID of the study programme
 * @returns the number of rows deleted
 * @throws {Error} if the query fails
 */
export async function removeFavorite(
  userId: number,
  studiengangId: string,
): Promise<number> {
  const query = `
    DELETE FROM favoriten
    WHERE user_id = $1 AND studiengang_id = $2;
  `;

  try {
    const result = await pool.query(query, [userId, studiengangId]);
    return result.rowCount || 0;
  } catch (err: any) {
    console.error(
      `[DB ERROR] Failed to remove favorite for user ${userId} and studiengang ${studiengangId}:`,
      err.message,
    );
    throw err;
  }
}

/**
 * Retrieves all favorites for a user
 * @param userId the ID of the user
 * @returns array of favorite study programme IDs
 * @throws {Error} if the query fails
 */
export async function getUserFavorites(userId: number): Promise<string[]> {
  const query = `
    SELECT studiengang_id FROM favoriten
    WHERE user_id = $1
    ORDER BY id DESC;
  `;

  try {
    const result = await pool.query(query, [userId]);
    return result.rows.map((row: any) => row.studiengang_id);
  } catch (err: any) {
    console.error(
      `[DB ERROR] Failed to retrieve favorites for user ${userId}:`,
      err.message,
    );
    throw err;
  }
}
