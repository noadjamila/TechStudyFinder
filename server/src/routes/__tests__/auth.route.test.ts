import express from "express";
import session from "express-session";
import request from "supertest";
import authRouter from "../auth.route";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "test-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  app.use("/api/auth", authRouter);
  return app;
};

describe("auth routes", () => {
  it("returns 200 and a session user for valid demo credentials", async () => {
    const app = buildApp();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "demo", password: "demo1234" });

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({ id: 1, username: "demo" });
  });

  it("returns 401 for invalid credentials", async () => {
    const app = buildApp();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "demo", password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("returns 400 if credentials are missing", async () => {
    const app = buildApp();

    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(400);
  });
});
