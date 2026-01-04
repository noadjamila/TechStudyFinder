import { Response, Request, Router } from "express";
import { findUserForLogin } from "../repositories/auth.repository";
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
authRouter.get("/me", async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json(req.session.user);
});

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
authRouter.post("/login", async (req: Request, res: Response) => {
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
authRouter.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
});

export default authRouter;
