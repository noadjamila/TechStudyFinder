import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  findUserByUsername,
  updatePasswordById,
  deleteUserById,
} from "../repositories/auth.repository";

/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function changePassword(req: Request, res: Response) {
  const userId = req.session.user?.id;
  const { currentPassword, newPassword } = req.body;
  if (!userId) return res.status(401).json({ error: "Nicht authentifiziert!" });
  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: "Unvollständige Daten" });

  const dbUser = await findUserByUsername(req.session.user!.username);
  if (!dbUser) return res.status(404).json({ error: "User nicht gefunden" });

  const ok = await bcrypt.compare(currentPassword, dbUser.password_hash);
  if (!ok)
    return res
      .status(403)
      .json({ error: "Das eingegebene aktuelle Passwort ist nicht korrekt." });

  const hash = await bcrypt.hash(newPassword, 12);
  await updatePasswordById(userId, hash);
  return res.status(200).json({ message: "Passwort erfolgreich geändert" });
}

/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function deleteUser(req: Request, res: Response) {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: "Nicht authentifiziert" });
  await deleteUserById(userId);
  req.session.destroy(() => {});
  res.clearCookie("connect.sid");
  return res.status(200).json({ message: "User deleted" });
}
