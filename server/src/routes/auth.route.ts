import { Router } from "express";

export const loginRouter = Router;
export const logoutRouter = Router;

loginRouter.post("/login", (req: any, res: any) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.user = { id: user.id, username: user.username };

  return res
    .status(200)
    .json({ message: "Login successful", user: req.session.user });
});

logoutRouter.post("/logout", (req: any, res: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
});
