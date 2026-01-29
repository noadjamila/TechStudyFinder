import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminAuthProvider, useAdminAuth } from "../AdminAuthContext";
import { MemoryRouter } from "react-router-dom";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

const TestComponent = () => {
  const { admin, login, logout, isLoading } = useAdminAuth();
  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="user">{admin?.username ?? "null"}</div>
      <button onClick={() => login("test", "123")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const renderWithProvider = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("AdminAuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads current admin on mount", async () => {
    const adminData = { id: 1, username: "john" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => adminData,
    });

    renderWithProvider(
      <AdminAuthProvider>
        <TestComponent />
      </AdminAuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("john"),
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("login sets admin", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false }) // initial /me call returns null
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2, username: "test" }),
      }); // login call

    renderWithProvider(
      <AdminAuthProvider>
        <TestComponent />
      </AdminAuthProvider>,
    );

    const userSim = userEvent.setup();
    await userSim.click(screen.getByText("login"));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("test"),
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("logout clears admin and navigates", async () => {
    const adminData = { id: 1, username: "john" };
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => adminData }) // /me
      .mockResolvedValueOnce({ ok: true }); // logout

    renderWithProvider(
      <AdminAuthProvider>
        <TestComponent />
      </AdminAuthProvider>,
    );

    // wait for /me fetch
    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("john"),
    );

    const userSim = userEvent.setup();
    await userSim.click(screen.getByText("logout"));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("null"),
    );
    expect(navigateMock).toHaveBeenCalledWith("/admin/login", {
      replace: true,
    });
  });

  it("useAdminAuth throws error outside provider", () => {
    const BrokenComponent = () => {
      useAdminAuth();
      return null;
    };
    expect(() => render(<BrokenComponent />)).toThrow(
      "useAdminAuth must be used within AdminAuthProvider",
    );
  });
});
