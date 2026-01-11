import { pool } from "./db";
import "dotenv/config";

async function createSessionTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        PRIMARY KEY ("sid")
      )
      WITH (OIDS=FALSE);
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log("Session table created successfully!");
  } catch (err) {
    console.error("Error creating session table:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createSessionTable();
