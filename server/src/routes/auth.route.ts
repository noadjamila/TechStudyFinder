import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getUser,
  login,
  logout,
} from "../controllers/auth.controller";
import { register } from "../controllers/user.controller";
import bcrypt from "bcrypt";
import { findByUsername, createUser } from "../repositories/users.repository";

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Body: { username: string, password: string }
 * Response: { user: { id: number, username: string } }
 * Registers a new user with the provided credentials.
 * Errors:
 * - 400: Invalid username or password format
 * - 409: User already exists
 */
authRouter.post("/register", register);

/**
 * GET /api/auth/me
 * Response: { id: number, username: string }
 * Retrieves the currently authenticated user's information.
 * Errors:
 * - 401: Not authenticated
 */
authRouter.get("/me", getUser);

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
authRouter.post("/login", login);

/**
 * POST /api/auth/register
 * Body: { username: string, password: string }
 * Response: { message: string }
 * Registers a new user with username and password.
 * Errors:
 * - 400: Missing credentials or invalid format
 * - 409: Username already exists
 * - 500: Registration failed
 */
authRouter.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  // Check if user already exists
  const existingUser = await findByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists" });
  }

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    await createUser(username, passwordHash);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
});

/**
 * POST /api/auth/logout
 * Response: { message: string }
 * Logs out the current user by destroying the session.
 * Returns a success message on completion.
 * Errors:
 * - 500: Logout failed
 */
authRouter.post("/logout", logout);

/**
 * POST /api/auth/change-password
 * Changes the passwort of the currently authenticated user.
 *
 * @returns HTTP response with:
 * - 200 OK: Password successfully changed
 * - 400 Bad Request: Missing required data
 * - 401 Unauthorized: User is not authenticated
 * - 403 Forbidden: Current password is incorrect
 * - 404 Not Found: User not found
 */
authRouter.post("/change-password", changePassword);

/**
 * DELETES /api/auth/me
 * Deletes the currently authenticated user.
 *
 * @returns HTTP response with:
 * - 200 OK: User successfully deleted
 * - 401 Unauthorized: User is not authenticated
 */
authRouter.delete("/me", deleteUser);

export default authRouter;
