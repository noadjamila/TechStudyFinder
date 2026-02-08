/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

export interface UserRecord {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface PublicUser {
  id: number;
  username: string;
  created_at: Date;
}
