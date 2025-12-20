import bcrypt from "bcrypt";
import { pool } from "../../db";

type AuthUser = {
  id: number;
  username: string;
  password_hash: string;
};

/**
 * Hardcoded users for quick testing without DB (plain passwords!).
 * In production, use only database-stored users.
 */
const hardcodedUsers: { id: number; username: string; password: string }[] = [
  { id: 1, username: "demo", password: "demo1234" },
];

/**
 * Finds a user by username and password for login.
 * @param username
 * @param password
 * @returns The user object with id and username if credentials are valid, otherwise null.
 */
export async function findUserForLogin(
  username: string,
  password: string,
): Promise<{ id: number; username: string } | null> {
  const localHit = hardcodedUsers.find(
    (u) => u.username === username && u.password === password,
  );
  if (localHit) {
    return { id: localHit.id, username: localHit.username };
  }

  const dbUser = await findUserByUsername(username);
  if (!dbUser) return null;

  const isValid = await bcrypt.compare(password, dbUser.password_hash);
  return isValid ? { id: dbUser.id, username: dbUser.username } : null;
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
