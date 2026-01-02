import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  findUserByUsername,
  updatePasswordById,
  deleteUserById,
} from "../repositories/auth.repository";

/**
 * Changes the password of the currently authenticated user.
 *
 * Preconditions:
 * - The user must be authenticated (req.session.user must exist).
 * - The current password must match the stored password.
 *
 * Flow:
 * 1. Validates that the user is authenticated.
 * 2. Validates that currentPassword and newPassword are provided.
 * 3. Loads the user from the database.
 * 4. Compares the provided current password with the stored password hash.
 * 5. Hashes the new password and updates it in the database.
 *
 * @param req Express request object containing session and body data
 * @param res Express response object
 *
 * @returns HTTP response with:
 * - 200 OK: Password successfully changed
 * - 400 Bad Request: Missing required data
 * - 401 Unauthorized: User is not authenticated
 * - 403 Forbidden: Current password is incorrect
 * - 404 Not Found: User not found
 */
export async function changePassword(req: Request, res: Response) {
  const userId = req.session.user?.id;
  const { currentPassword, newPassword } = req.body ?? {};
  if (!userId) return res.status(401).json({ error: "Nicht authentifiziert!" });
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Unvollständige Daten" });

  const dbUser = await findUserByUsername(req.session.user!.username);
  if (!dbUser) return res.status(404).json({ error: "User nicht gefunden" });

  const ok = await bcrypt.compare(currentPassword, dbUser.password_hash);
  if (!ok)
    return res
      .status(403)
      .json({ error: "Das eingegebene aktuelle Passwort ist nicht korrekt." });

  const hash = await bcrypt.hash(newPassword, 12);
  await updatePasswordById(userId, hash);
  return res.status(200).json({ message: "Passwort erfolgreich geändert" });
}

/**
 * Deletes the currently authenticated user.
 *
 * Preconditions:
 * - The user must be authenticated (req.session.user must exist).
 *
 * Flow:
 * 1. Validates that the user is authenticated.
 * 2. Deletes the user from the database.
 * 3. Destroys the current session.
 * 4. Clears the session cookie.
 *
 * @param req Express request object containing session data
 * @param res Express response object
 *
 * @returns HTTP response with:
 * - 200 OK: User successfully deleted
 * - 401 Unauthorized: User is not authenticated
 */
export async function deleteUser(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: "Nicht authentifiziert" });
  await deleteUserById(userId);
  req.session.destroy(() => {});
  res.clearCookie("connect.sid");
  return res.status(200).json({ message: "User deleted" });
}
