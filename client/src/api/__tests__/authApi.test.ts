import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authApi from "../authApi";

describe("authApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  /* ---------------- getCurrentUser ---------------- */
  describe("getCurrentUser", () => {
    it("returns user when response is ok", async () => {
      const mockUser = { id: 1, username: "john" };
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUser),
          }),
        ),
      );

      const user = await authApi.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it("returns null when response is not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: false })),
      );

      const user = await authApi.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  /* ---------------- login ---------------- */
  describe("login", () => {
    it("returns user data when login succeeds", async () => {
      const mockUser = { user: { id: 2, username: "alice" } };
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) }),
        ),
      );

      const res = await authApi.login("alice", "123");
      expect(res).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });

    it("throws an error when login fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: false })),
      );

      await expect(authApi.login("alice", "wrong")).rejects.toThrow(
        "Login fehlgeschlagen",
      );
    });
  });

  /* ---------------- logout ---------------- */
  describe("logout", () => {
    it("returns true when logout succeeds", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: true })),
      );

      const result = await authApi.logout();
      expect(result).toBe(true);
    });

    it("returns false when logout fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: false })),
      );

      const result = await authApi.logout();
      expect(result).toBe(false);
    });
  });

  /* ---------------- changePassword ---------------- */
  describe("changePassword", () => {
    it("returns true when password change succeeds", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: true })),
      );

      const result = await authApi.changePassword("old", "new");
      expect(result).toBe(true);
    });

    it("throws with server error message", async () => {
      const errorMessage = { message: "Invalid password" };
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.resolve(errorMessage),
          }),
        ),
      );

      await expect(authApi.changePassword("old", "wrong")).rejects.toThrow(
        "Invalid password",
      );
    });

    it("throws default error if response has no JSON", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve({
            ok: false,
            json: () => Promise.reject("no json"),
          }),
        ),
      );

      await expect(authApi.changePassword("old", "wrong")).rejects.toThrow(
        "Passwortänderung fehlgeschlagen",
      );
    });
  });

  /* ---------------- deleteUser ---------------- */
  describe("deleteUser", () => {
    it("returns true when delete succeeds", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: true })),
      );

      const result = await authApi.deleteUser();
      expect(result).toBe(true);
    });

    it("returns false when delete fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn(() => Promise.resolve({ ok: false })),
      );

      const result = await authApi.deleteUser();
      expect(result).toBe(false);
    });
  });
});
