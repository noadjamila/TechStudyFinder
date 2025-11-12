//creates and exports a reusable PostgreSQL connection pool
// using the pg library and environment variables loaded via dotenv
//manages the db queries, so the connection must not be established again

import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

console.log("Verbinde mit Datenbank auf Port:", process.env.DB_PORT);
