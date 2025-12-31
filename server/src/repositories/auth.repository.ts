import bcrypt from "bcrypt";
import { pool } from "../../db";

type AuthUser = {
  id: number;
  username: string;
  password_hash: string;
};

// Dummy hash to mitigate timing attacks (user enumeration)
const DUMMY_BCRYPT_HASH =
  process.env.DUMMY_BCRYPT_HASH ??
  "$2b$12$C6UzMDM.H6dfI/f/IKcEe.OvJH5tq3c5F5QyXv3D1Gx5aFQvZyKqG";

/**
 * Finds a user by username and password for login.
 * Uses constant time password comparison to prevent timing attacks.
 * @param username
 * @param password
 * @returns The user object with id and username if credentials are valid, otherwise null.
 */
export async function findUserForLogin(
  username: string,
  password: string,
): Promise<{ id: number; username: string } | null> {
  const dbUser = await findUserByUsername(username);

  const passwordHash = dbUser ? dbUser.password_hash : DUMMY_BCRYPT_HASH;

  const isValid = await bcrypt.compare(password, passwordHash);

  if (!dbUser || !isValid) return null;

  return { id: dbUser.id, username: dbUser.username };
}

/**
 * Finds a user by username from the database.
 * @param username
 * @returns The user object if found, otherwise null.
 */
export async function findUserByUsername(
  username: string,
): Promise<AuthUser | null> {
  const { rows } = await pool.query<AuthUser>(
    "SELECT id, username, password_hash FROM users WHERE username = $1",
    [username],
  );

  return rows[0] ?? null;
}

/**
 *
 * @param id
 * @param passwordHash
 */
export async function updatePasswordById(id: number, passwordHash: string) {
  await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
    passwordHash,
    id,
  ]);
}

/**
 *
 * @param id
 */
export async function deleteUserById(id: number) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}
