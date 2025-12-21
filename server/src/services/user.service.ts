import bcrypt from "bcrypt";
import { createUser, findByUsername } from "../repositories/users.repository";
import { PublicUser } from "../types/user";

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
  if (typeof username !== "string") {
    return { valid: false, message: "Username must be a string." };
  }

  if (username.length < 5) {
    return { valid: false, message: "Username must be at least 5 characters." };
  }

  if (username.length > 30) {
    return { valid: false, message: "Username must be at most 30 characters." };
  }

  // Pattern: starts with alphanumeric, can contain alphanumeric/underscore/hyphen in middle, ends with alphanumeric
  // This prevents SQL injection, XSS, and confusing patterns like __admin or --user
  // For 5+ character requirement: first char + (middle chars* + last char)
  const usernamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/;
  if (!usernamePattern.test(username)) {
    return {
      valid: false,
      message:
        "Username must start and end with alphanumeric characters. Only letters, numbers, underscores, and hyphens are allowed.",
    };
  }

  return { valid: true };
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (typeof password !== "string" || password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }
  if (password.length > 72) {
    return {
      valid: false,
      message: "Password must be at most 72 characters.",
    };
  }
  if (!/[A-Za-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one letter.",
    };
  }
  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number.",
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character.",
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
    const error: any = new Error("username already in use");
    error.status = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const created = await createUser(username, passwordHash);
  return {
    id: created.id,
    username: created.username,
    created_at: created.created_at,
  };
}
