/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Router } from "express";
import {
  changePassword,
  deleteUser,
  getUser,
  login,
  logout,
} from "../controllers/auth.controller";
import { register } from "../controllers/user.controller";

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Body: { username: string, password: string }
 * Response: { user: { id: number, username: string } }
 * Registers a new user with the provided credentials.
 * Errors:
 * - 400: Invalid username or password format
 * - 409: User already exists
 */
authRouter.post("/register", register);

/**
 * GET /api/auth/me
 * Response: { id: number, username: string }
 * Retrieves the currently authenticated user's information.
 * Errors:
 * - 401: Not authenticated
 */
authRouter.get("/me", getUser);

/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 * Response: { message: string, user?: { id: number, username: string } }
 * Logs in a user by verifying credentials and creating a session.
 * Returns user info on success.
 * Errors:
 * - 400: Missing credentials
 * - 401: Invalid credentials
 */
authRouter.post("/login", login);

/**
 * POST /api/auth/logout
 * Response: { message: string }
 * Logs out the current user by destroying the session.
 * Returns a success message on completion.
 * Errors:
 * - 500: Logout failed
 */
authRouter.post("/logout", logout);

/**
 * POST /api/auth/change-password
 * Changes the passwort of the currently authenticated user.
 *
 * @returns HTTP response with:
 * - 200 OK: Password successfully changed
 * - 400 Bad Request: Missing required data
 * - 401 Unauthorized: User is not authenticated
 * - 403 Forbidden: Current password is incorrect
 * - 404 Not Found: User not found
 */
authRouter.post("/change-password", changePassword);

/**
 * DELETES /api/auth/me
 * Deletes the currently authenticated user.
 *
 * @returns HTTP response with:
 * - 200 OK: User successfully deleted
 * - 401 Unauthorized: User is not authenticated
 */
authRouter.delete("/me", deleteUser);

export default authRouter;
