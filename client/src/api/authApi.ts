/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

export async function getCurrentUser(fetchFn: typeof fetch = fetch) {
  const res = await fetchFn("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  return await res.json();
}

export async function login(
  username: string,
  password: string,
  fetchFn: typeof fetch = fetch,
) {
  const res = await fetchFn("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login fehlgeschlagen");
  return await res.json();
}

export async function logout(fetchFn: typeof fetch = fetch) {
  const res = await fetchFn("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

export async function changePassword(
  password: string,
  newPassword: string,
  fetchFn: typeof fetch = fetch,
) {
  const res = await fetchFn("/api/auth/change-password", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword: password, newPassword }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      data?.message ?? data?.error ?? "Passwortänderung fehlgeschlagen",
    );
  }

  return true;
}

export async function deleteUser(fetchFn: typeof fetch = fetch) {
  const res = await fetchFn("/api/auth/me", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.ok;
}
