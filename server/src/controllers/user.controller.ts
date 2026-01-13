import { Request, Response } from "express";
import {
  registerUser,
  validatePassword,
  validateUsername,
  AppError,
} from "../services/user.service";

// Type guard to check if error is AppError
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// Controller function to handle user registration

export async function register(req: Request, res: Response) {
  const { username, password } = req.body ?? {};

  // Validate username first
  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username ist erforderlich" });
  }

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    return res.status(400).json({ error: usernameValidation.message });
  }

  // Then validate password
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Passwort ist erforderlich" });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.message });
  }

  // Attempt to register the user

  try {
    const user = await registerUser(username, password);
    return res.status(201).json({ user });
  } catch (error: unknown) {
    console.error("[register] Registration error:", error);

    if (isAppError(error)) {
      const status = error.status ?? 500;
      return res.status(status).json({ error: error.message });
    }

    // Fallback for unknown error types
    return res
      .status(500)
      .json({
        error: "Registrierung fehlgeschlagen - bitte versuche es erneut!",
      });
  }
}
