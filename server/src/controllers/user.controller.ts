import { Request, Response } from "express";
import { registerUser, validatePassword } from "../services/user.service";

export async function register(req: Request, res: Response) {
  const { username, password } = req.body ?? {};

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Invalid username" });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Invalid password" });
  }

  const pw = validatePassword(password);
  if (!pw.valid) {
    return res.status(400).json({ error: pw.message });
  }

  try {
    const user = await registerUser(username, password);
    return res.status(201).json({ user });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return res
      .status(status)
      .json({ error: err?.message ?? "Registration failed" });
  }
}
