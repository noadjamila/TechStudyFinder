import request from "supertest";
import { pool } from "../../../db";
import { app } from "../../../index";

describe("Users Registration Endpoint - Integration Tests", () => {
  beforeEach(async () => {
    try {
      await pool.query(`DROP TABLE IF EXISTS users`);
    } catch (err) {
      // Ignore errors if pool is not available
      console.warn("Could not drop users table in beforeEach", err);
    }
  });

  afterAll(async () => {
    try {
      await pool.query(`DROP TABLE IF EXISTS users`);
    } catch (err) {
      // Ignore errors if pool is not available
      console.warn("Could not drop users table in afterAll", err);
    }
  });

  it("registers a new user with valid credentials", async () => {
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
