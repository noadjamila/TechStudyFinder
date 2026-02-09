/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { pool } from "../../db";
import { UserRecord } from "../types/user";

export async function findByUsername(
  username: string,
): Promise<UserRecord | null> {
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
