import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

/**
 * Retrieves the id and username of the currently authenticated user.
 *
 * @param req Express request object containing session
 * @param res Express response object
 * @returns Json with { id: number, username: string } or 401 HTTP response
 */
export async function getUser(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Nicht authentifiziert!" });
  }

  return res.json(req.session.user);
}

/**
 * Body: { username: string, password: string }
 * Response: { message: string, user?: { id: number, username: string } }
 * Logs in a user by verifying credentials and creating a session.
 * Returns user info on success.
 * Errors:
 * - 400: Missing credentials
 * - 401: Invalid credentials
 */
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const user = await AuthService.login(username, password);

    req.session.user = { id: user.id, username: user.username };

    return res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (err: any) {
    switch (err.message) {
      case "USER_NOT_FOUND":
        return res.status(401).json({ message: "Invalid credentials: " });
    }
  }
}

/**
 * Response: { message: string }
 * Logs out the current user by destroying the session.
 * Returns a success message on completion.
 * Errors:
 * - 500: Logout failed
 */
export async function logout(req: Request, res: Response) {
  req.session.destroy((err: Error | null) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
}

/**
 * Changes the password of the currently authenticated user.
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
  const user = req.session.user;
  const { currentPassword, newPassword } = req.body ?? {};
  if (!user) return res.status(401).json({ error: "Nicht authentifiziert!" });
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Unvollständige Daten" });

  try {
    await AuthService.changePassword(
      user.id,
      user.username,
      currentPassword,
      newPassword,
    );

    return res.status(200).json({ message: "Passwort erfolgreich geändert" });
  } catch (err: any) {
    switch (err.message) {
      case "USER_NOT_FOUND":
        return res.status(404).json({ error: "User nicht gefunden" });
      case "INVALID_PASSWORD":
        return res.status(403).json({
          error: "Das eingegebene aktuelle Passwort ist nicht korrekt.",
        });
      default:
        return res.status(500).json({ error: "Interner Serverfehler" });
    }
  }
}

/**
 * Deletes the currently authenticated user.
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

  await AuthService.deleteUser(userId);

  req.session.destroy(() => {});
  res.clearCookie("connect.sid");
  return res.status(200).json({ message: "User deleted" });
}
