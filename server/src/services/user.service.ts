import bcrypt from "bcrypt";
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

async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
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
