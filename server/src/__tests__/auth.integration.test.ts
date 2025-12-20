import request from "supertest";
import { app } from "../../index";

describe("auth logout", () => {
  const agent = request.agent(app);

  it("logs out an authenticated user", async () => {
    // login
    const loginRes = await agent
      .post("/auth/login")
      .send({ username: "demo", password: "demo1234" });

    expect(loginRes.status).toBe(200);

    // logout
    const logoutRes = await agent.post("/auth/logout");

    expect(logoutRes.status).toBe(200);
  });

  it("invalidates the session after logout", async () => {
    // login
    await agent
      .post("/auth/login")
      .send({ username: "demo", password: "demo1234" });

    // logout
    await agent.post("/auth/logout");

    // access protected route
    const meRes = await agent.get("/auth/me");

    expect(meRes.status).toBe(401);
  });

  it("allows logout even when not logged in", async () => {
    const res = await request(app).post("/auth/logout");

    expect(res.status).toBe(200);
  });
});
