import { pool } from "../../db";
import { UserRecord } from "../types/user";

async function ensureUsersTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function findByUsername(
  username: string,
): Promise<UserRecord | null> {
  await ensureUsersTable();
  const result = await pool.query(
    `SELECT id, username, password_hash, created_at
     FROM users
     WHERE username = $1
     LIMIT 1`,
    [username],
  );
  if (!result || !result.rows) {
    return null;
  }
  return result.rows[0] ?? null;
}

export async function createUser(
  username: string,
  passwordHash: string,
): Promise<UserRecord> {
  await ensureUsersTable();
  const result = await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username, password_hash, created_at`,
    [username, passwordHash],
  );
  if (!result || !result.rows || result.rows.length === 0) {
    throw new Error("Failed to create user");
  }
  return result.rows[0];
}
