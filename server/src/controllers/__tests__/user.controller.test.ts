import request from "supertest";
import { app } from "../../../index";

describe("Users Registration Endpoint - Unit Tests", () => {
  it("rejects registration with invalid username format", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "_invalid_user",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Username");
  });

  it("rejects registration with username too short", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "user",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("mindestens 5 Zeichen");
  });

  it("rejects registration with username too long", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "a".repeat(31),
        password: "ValidPass123!",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("maximal 30 Zeichen");
  });

  it("rejects registration with username containing special characters", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "user@domain",
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Username");
  });

  it("rejects registration with weak password (no special char)", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "test_user2",
      password: "WeakPass123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Sonderzeichen");
  });

  it("rejects registration without username", async () => {
    const response = await request(app).post("/api/auth/register").send({
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Username ist erforderlich");
  });

  it("rejects registration without password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "test_user",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Passwort ist erforderlich");
  });
});
