import bcrypt from "bcrypt";
import { createUser, findByUsername } from "../repositories/users.repository";
import { PublicUser } from "../types/user";

export function validateUsername(username: string): {
  valid: boolean;
  message?: string;
} {
  if (typeof username !== "string" || username.trim().length === 0) {
    return { valid: false, message: "Username is required." };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    return { valid: false, message: "Username must be at least 3 characters." };
  }

  if (trimmedUsername.length > 30) {
    return { valid: false, message: "Username must not exceed 30 characters." };
  }

  // Username must start and end with alphanumeric characters
  // Can contain letters, numbers, underscores, and hyphens in between
  const startsWithAlphanumeric = /^[a-zA-Z0-9]/.test(trimmedUsername);
  const endsWithAlphanumeric = /[a-zA-Z0-9]$/.test(trimmedUsername);
  const containsOnlyAllowedChars = /^[a-zA-Z0-9_-]+$/.test(trimmedUsername);

  if (!startsWithAlphanumeric || !endsWithAlphanumeric || !containsOnlyAllowedChars) {
    return {
      valid: false,
      message: "Username must start and end with a letter or number, and can only contain letters, numbers, underscores, and hyphens.",
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
  const saltRounds = 12;
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
