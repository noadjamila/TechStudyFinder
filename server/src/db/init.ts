import { pool } from "../../db";

/**
 * Initialize all required database tables on server startup.
 * This ensures tables exist before any requests are processed.
 */
export async function initializeDatabaseTables(): Promise<void> {
  try {
    console.log("Initializing database tables...");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Create favouriten table (for storing user favorites)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favoriten (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        studiengang_id TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, studiengang_id)
      )
    `);

    console.log("Database tables initialized successfully");
  } catch (err) {
    console.error("Failed to initialize database tables:", err);
    throw err;
  }
}
