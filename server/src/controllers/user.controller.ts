import { Request, Response } from "express";
import {
  registerUser,
  validatePassword,
  validateUsername,
} from "../services/user.service";

// Controller function to handle user registration

export async function register(req: Request, res: Response) {
  const { username, password } = req.body ?? {};

  // Validate username first
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return res.status(400).json({ error: usernameValidation.message });
  }

  // Then validate password
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required" });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.message });
  }

  // Attempt to register the user

  try {
    const user = await registerUser(username, password);
    return res.status(201).json({ user });
  } catch (err: any) {
    console.error("[register] Registration error:", err);
    const status = err?.status ?? 500;
    return res
      .status(status)
      .json({ error: err?.message ?? "Registration failed" });
  }
}
