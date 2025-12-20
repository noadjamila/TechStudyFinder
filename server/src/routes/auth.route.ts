import { Response, Request, Router } from "express";
import { findUserForLogin } from "../repositories/auth.repository";

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 * Response: { message: string, user?: { id: number, username: string } }
 * Logs in a user by verifying credentials and creating a session.
 * Returns user info on success.
 * Errors:
 * - 400: Missing credentials
 * - 401: Invalid credentials
 */
authRouter.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const user = await findUserForLogin(username, password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  req.session.user = { id: user.id, username: user.username };

  return res
    .status(200)
    .json({ message: "Login successful", user: req.session.user });
});

/**
 * POST /api/auth/logout
 * Response: { message: string }
 * Logs out the current user by destroying the session.
 * Returns a success message on completion.
 * Errors:
 * - 500: Logout failed
 */
authRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
});

export default authRouter;
