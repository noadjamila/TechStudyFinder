import { pool } from "./db";
import "dotenv/config";

async function createTables() {
  try {
    console.log("Creating users table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);
    console.log("✓ Users table created");

    console.log("Creating favoriten table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favoriten (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        studiengang_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, studiengang_id)
      );
      CREATE INDEX IF NOT EXISTS idx_favoriten_user_id ON favoriten(user_id);
      CREATE INDEX IF NOT EXISTS idx_favoriten_studiengang_id ON favoriten(studiengang_id);
    `);
    console.log("✓ Favoriten table created");

    console.log("\n✓ All tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTables();
