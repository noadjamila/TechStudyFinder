import { Router } from "express";
import { findUserForLogin } from "../repositories/auth.repository";

export const authRouter = Router();

authRouter.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  const user = await findUserForLogin(username, password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  req.session.user = { id: user.id, username: user.username };

  return res
    .status(200)
    .json({ message: "Login successful", user: req.session.user });
});

authRouter.post("/logout", (req: any, res: any) => {
  req.session.destroy((err: any) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
});

export default authRouter;
