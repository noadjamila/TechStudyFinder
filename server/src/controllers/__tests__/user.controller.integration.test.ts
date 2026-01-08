import request from "supertest";
import { pool } from "../../../db";
import { app } from "../../../index";
import fs from "fs";
import path from "path";

describe("Users Registration Endpoint - Integration Tests", () => {
  let dbAvailable = true;

  beforeAll(async () => {
    try {
      await pool.query("SELECT 1");
    } catch {
      dbAvailable = false;
      console.warn("Database not available, skipping integration tests");
    }
  });

  beforeEach(async () => {
    if (!dbAvailable) return;
    try {
      await pool.query(`DROP TABLE IF EXISTS favourites CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

      // Create the users table for the test
      const usersSqlPath = path.join(__dirname, "../../../db/schema/users.sql");
      const usersSql = fs.readFileSync(usersSqlPath, "utf8");
      const statements = usersSql
        .split(/;\s*$/m)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await pool.query(stmt);
      }
    } catch (err) {
      console.warn("Could not set up tables in beforeEach", err);
    }
  });

  afterAll(async () => {
    if (!dbAvailable) return;
    try {
      await pool.query(`DROP TABLE IF EXISTS favourites CASCADE`);
      await pool.query(`DROP TABLE IF EXISTS users CASCADE`);
    } catch (err) {
      console.warn("Could not drop tables in afterAll", err);
    }
  });

  it("registers a new user with valid credentials", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "test_user1",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.username).toBe("test_user1");
    expect(response.body.user.password_hash).toBeUndefined();
  });

  it("rejects registration with duplicate username", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    await request(app).post("/api/auth/register").send({
      username: "duplicate_user",
      password: "FirstPass123!",
    });

    const response = await request(app).post("/api/auth/register").send({
      username: "duplicate_user",
      password: "SecondPass123!",
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain("username");
  });
});
