import { randomBytes, scryptSync } from "crypto";
import { createUser, findByUsername } from "../repositories/users.repository";
import { PublicUser } from "../types/user";

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

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
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

  const passwordHash = hashPassword(password);
  const created = await createUser(username, passwordHash);
  return {
    id: created.id,
    username: created.username,
    created_at: created.created_at,
  };
}
