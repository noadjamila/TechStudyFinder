import bcrypt from "bcrypt";
import { pool } from "../../db";

type AuthUser = {
  id: number;
  username: string;
  password_hash: string;
};

// Temporary hardcoded users for local testing (plain passwords!)
const hardcodedUsers: { id: number; username: string; password: string }[] = [
  { id: 1, username: "demo", password: "demo1234" },
];

export async function findUserForLogin(
  username: string,
  password: string,
): Promise<Pick<AuthUser, "id" | "username"> | null> {
  const localHit = hardcodedUsers.find(
    (u) => u.username === username && u.password === password,
  );
  if (localHit) {
    return { id: localHit.id, username: localHit.username };
  }

  const dbUser = await findUserByUsernameFromDb(username);
  if (!dbUser) return null;

  const isValid = await bcrypt.compare(password, dbUser.password_hash);
  return isValid ? { id: dbUser.id, username: dbUser.username } : null;
}

export async function findUserByUsernameFromDb(
  username: string,
): Promise<AuthUser | null> {
  const { rows } = await pool.query(
    "SELECT id, username, password_hash FROM users WHERE username = $1",
    [username],
  );
  return rows[0] ?? null;
}
