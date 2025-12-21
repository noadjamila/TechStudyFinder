import { Request, Response } from "express";
import { registerUser, validatePassword } from "../services/user.service";

// Controller function to handle user registration

export async function register(req: Request, res: Response) {
  const { username, password } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Invalid username" });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid password" });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.message });
  }

  // Attempt to register the user

  try {
    console.log("[register] Attempting to register user:", username);
    const user = await registerUser(username, password);
    console.log("[register] Registration successful for:", username);
    return res.status(201).json({ user });
  } catch (err: any) {
    console.error("[register] Registration error:", err);
    const status = err?.status ?? 500;
    return res
      .status(status)
      .json({ error: err?.message ?? "Registration failed" });
  }
}
