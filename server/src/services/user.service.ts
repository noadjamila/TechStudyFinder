import bcrypt from "bcrypt";
import { createUser, findByUsername } from "../repositories/users.repository";
import { PublicUser } from "../types/user";

/**
 * Custom error class with HTTP status code
 * Used for API error responses
 */
export class AppError extends Error {
  constructor(
    message: string,
    public status: number = 500,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validates username against security and format requirements
 * - Length: 5-30 characters
 * - Pattern: Must start and end with alphanumeric, can contain underscores/hyphens in middle
 * - Prevents SQL injection, XSS, and confusing patterns
 */
export function validateUsername(username: string): {
  valid: boolean;
  message?: string;
} {
  if (username.length < 5) {
    return {
      valid: false,
      message: "Username muss mindestens 5 Zeichen lang sein.",
    };
  }

  if (username.length > 30) {
    return {
      valid: false,
      message: "Username darf maximal 30 Zeichen lang sein.",
    };
  }

  // Pattern: starts with alphanumeric, can contain alphanumeric/underscore/hyphen in middle, ends with alphanumeric
  // This prevents SQL injection, XSS, and confusing patterns like __admin or --user
  // For 5+ character requirement: first char + (middle chars* + last char)
  const usernamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/;
  if (!usernamePattern.test(username)) {
    return {
      valid: false,
      message:
        "Username muss mit einem Buchstaben oder einer Zahl beginnen und enden. Nur Buchstaben, Zahlen, Unterstriche und Bindestriche sind erlaubt.",
    };
  }

  return { valid: true };
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (typeof password !== "string" || password.length < 8) {
    return {
      valid: false,
      message: "Passwort muss mindestens 8 Zeichen lang sein.",
    };
  }
  if (password.length > 72) {
    return {
      valid: false,
      message: "Passwort darf maximal 72 Zeichen lang sein.",
    };
  }
  if (!/[A-Za-z]/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens einen Buchstaben enthalten.",
    };
  }
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens eine Zahl enthalten.",
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      message: "Passwort muss mindestens ein Sonderzeichen enthalten.",
    };
  }
  return { valid: true };
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

  if (isNaN(saltRounds)) {
    throw new Error(
      `Invalid BCRYPT_SALT_ROUNDS value: "${process.env.BCRYPT_SALT_ROUNDS}". Must be a number between 4 and 20.`,
    );
  }

  if (saltRounds < 4 || saltRounds > 20) {
    throw new Error(
      `Invalid BCRYPT_SALT_ROUNDS value: ${saltRounds}. Must be between 4 and 20.`,
    );
  }

  return bcrypt.hash(password, saltRounds);
}

export async function registerUser(
  username: string,
  password: string,
): Promise<PublicUser> {
  const existing = await findByUsername(username);
  if (existing) {
    throw new AppError("username already in use", 409);
  }

  const passwordHash = await hashPassword(password);
  const created = await createUser(username, passwordHash);
  return {
    id: created.id,
    username: created.username,
    created_at: created.created_at,
  };
}
