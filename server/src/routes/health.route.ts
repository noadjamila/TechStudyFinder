/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Request, Response, Router } from "express";

const router = Router();

router.get("/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from the backend!👋" });
});

export default router;
