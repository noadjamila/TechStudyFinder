import { pool } from "./db";
import "dotenv/config";

/**
 * @deprecated This script is deprecated and should not be used in production.
 * Use init.sql script instead to create tables with proper IDENTITY columns.
 *
 * This script uses SERIAL which allows manual ID insertion, leading to potential
 * ID conflicts when users are deleted and recreated.
 *
 * For Docker deployments, mount init.sql as /docker-entrypoint-initdb.d/init.sql
 */
async function createTables() {
  console.warn("⚠️  WARNING: This script is deprecated!");
  console.warn("⚠️  Use init.sql instead for proper IDENTITY column support");
  console.warn("⚠️  Continuing in 3 seconds...\n");

  await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    console.debug("Creating users table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `);
    console.debug("✓ Users table created");

    console.debug("Creating favoriten table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favoriten (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        studiengang_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, studiengang_id)
      );
      CREATE INDEX IF NOT EXISTS idx_favoriten_user_id ON favoriten(user_id);
      CREATE INDEX IF NOT EXISTS idx_favoriten_studiengang_id ON favoriten(studiengang_id);
    `);
    console.debug("✓ Favoriten table created");

    console.debug("\n✓ All tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTables();
