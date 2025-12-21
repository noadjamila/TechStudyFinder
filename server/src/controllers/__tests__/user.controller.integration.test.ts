import request from "supertest";
import { pool } from "../../../db";
import { app } from "../../../index";

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
      await pool.query(`DROP TABLE IF EXISTS users`);
    } catch (err) {
      console.warn("Could not drop users table in beforeEach", err);
    }
  });

  afterAll(async () => {
    if (!dbAvailable) return;
    try {
      await pool.query(`DROP TABLE IF EXISTS users`);
    } catch (err) {
      console.warn("Could not drop users table in afterAll", err);
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

  it("rejects registration with invalid username - too short", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "ab",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("at least 3 characters");
  });

  it("rejects registration with invalid username - too long", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "a".repeat(31),
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("must not exceed 30 characters");
  });

  it("rejects registration with invalid username - special characters", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "user@name",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("must start and end");
  });

  it("rejects registration with SQL injection attempt in username", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "admin'; DROP TABLE users--",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("must start and end");
  });

  it("rejects registration with XSS attempt in username", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "<script>alert('xss')</script>",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("must start and end");
  });

  it("rejects registration with username starting with underscore", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "_username",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("must start and end");
  });

  it("rejects registration with username ending with hyphen", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "username-",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("must start and end");
  });

  it("accepts registration with valid username containing underscores and hyphens", async () => {
    if (!dbAvailable) {
      console.warn("Skipping test - database not available");
      return;
    }

    const response = await request(app).post("/api/auth/register").send({
      username: "user_name-123",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.username).toBe("user_name-123");
  });
});
