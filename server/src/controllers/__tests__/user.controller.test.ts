import request from "supertest";
import { app } from "../../../index";

describe("Users Registration Endpoint - Unit Tests", () => {
  it("rejects registration with weak password (no special char)", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "test_user2",
      password: "WeakPass123",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("special character");
  });

  it("rejects registration without username", async () => {
    const response = await request(app).post("/api/auth/register").send({
      password: "ValidPass123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("username");
  });

  it("rejects registration without password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "test_user",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("password");
  });
});
