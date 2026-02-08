/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
    };
    admin?: {
      id: number;
      username: string;
    };
  }
}
