import bcrypt from "bcrypt";
import { createUser, findByUsername } from "../repositories/users.repository";
import { PublicUser } from "../types/user";

// Parse and validate salt rounds once at module load time
const SALT_ROUNDS = (() => {
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
  
  return saltRounds;
})();

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
  return bcrypt.hash(password, SALT_ROUNDS);
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
