import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";
import * as authApi from "../../api/authApi";

vi.mock("../../api/authApi", () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));

const TestComponent = () => {
  const { user, login, logout, isLoading } = useAuth();
  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="user">{user?.username ?? "null"}</div>
      <button onClick={() => login("test", "123")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads current user on mount", async () => {
    vi.mocked(authApi.getCurrentUser).mockResolvedValue({
      id: 1,
      username: "john",
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("john"),
    );
  });

  it("login sets user", async () => {
    vi.mocked(authApi.getCurrentUser).mockResolvedValue(null);
    vi.mocked(authApi.login).mockResolvedValue({
      user: { id: 2, username: "test" },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    const userSim = userEvent.setup();
    await userSim.click(screen.getByText("login"));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("test"),
    );
  });

  it("logout clears user", async () => {
    vi.mocked(authApi.getCurrentUser).mockResolvedValue({
      id: 1,
      username: "john",
    });
    vi.mocked(authApi.logout).mockResolvedValue(true);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("john"),
    );

    const userSim = userEvent.setup();
    await userSim.click(screen.getByText("logout"));

    expect(screen.getByTestId("user")).toHaveTextContent("null");
  });

  it("useAuth throws error when used outside AuthProvider", () => {
    const BrokenComponent = () => {
      useAuth();
      return null;
    };

    expect(() => render(<BrokenComponent />)).toThrow(
      "useAuth must be used within AuthProvider",
    );
  });
});
