export async function getCurrentUser() {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  return await res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return await res.json();
}

export async function logout() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

export async function changePassword(password: string, newPassword: string) {
  const res = await fetch("/api/auth/change-password", {
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

export async function deleteUser() {
  const res = await fetch("/api/auth/me", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.ok;
}
