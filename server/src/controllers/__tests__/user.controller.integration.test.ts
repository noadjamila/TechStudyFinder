import request from "supertest";
import { pool } from "../../../db";
import { app } from "../../../index";

describe("Users Registration Endpoint - Integration Tests", () => {
  const dbName = process.env.DB_NAME ?? "";
  const isTestDb = dbName.toLowerCase().includes("test");
  let dbAvailable = true;

  beforeAll(async () => {
    if (!isTestDb) {
      throw new Error(
        `Refusing to run integration tests on non-test DB: ${dbName || "(empty)"}`,
      );
    }
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
    } catch (err) {
      console.warn("Could not drop tables in beforeEach", err);
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
