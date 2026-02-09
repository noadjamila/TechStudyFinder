/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import bcrypt from "bcrypt";
import {
  findUserByUsername,
  updatePasswordById,
  deleteUserById,
  findUserForLogin,
} from "../repositories/auth.repository";

export class AuthService {
  /**
   * Changes the password of a user.
   * Makes sure the user exists and provided the correct password.
   *
   * @param userId Id of the user
   * @param username Name of the user
   * @param currentPassword Password of the user
   * @param newPassword The new password
   */
  static async changePassword(
    userId: number,
    username: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const dbUser = await findUserByUsername(username);
    if (!dbUser) {
      throw new Error("USER_NOT_FOUND");
    }

    const ok = await bcrypt.compare(currentPassword, dbUser.password_hash);
    if (!ok) {
      throw new Error("INVALID_PASSWORD");
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await updatePasswordById(userId, hash);
  }

  /**
   * Deletes a user by his ID.
   *
   * @param userId Id of the user
   */
  static async deleteUser(userId: number) {
    await deleteUserById(userId);
  }

  /**
   * User Login
   */
  static async login(username: string, password: string) {
    const user = await findUserForLogin(username, password);
    if (!user) {
      throw new Error("INVALID");
    }
    return user;
  }
}
