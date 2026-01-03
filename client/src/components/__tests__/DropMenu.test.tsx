import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DropMenu from "../DropMenu";
import "@testing-library/jest-dom";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { waitFor } from "@testing-library/react";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../contexts/AuthContext", async () => {
  const actual = await vi.importActual("../../contexts/AuthContext");
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock("../../api/authApi", () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ id: 1, name: "Test User" }),
  login: vi.fn(),
  logout: vi.fn(),
}));

const renderWithAuth = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
};

describe("DropMenu Component", () => {
  const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;
  const mockLogin = vi.fn();
  const mockLogout = vi.fn();
  const mockSetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
      login: mockLogin,
      setUser: mockSetUser,
      isLoading: false,
    });
  });

  it("renders menu icon", () => {
    renderWithAuth(<DropMenu />);

    const menuIcon = screen.getByRole("button");
    expect(menuIcon).toBeInTheDocument();
  });

  it("opens and closes the menu and renders correct items when user is not authenticated", async () => {
    renderWithAuth(<DropMenu />);
    const menuIcon = screen.getByRole("button");
    fireEvent.click(menuIcon);

    expect(screen.getByText("Einloggen")).toBeInTheDocument();
    expect(screen.getByText("Impressum")).toBeInTheDocument();
    expect(screen.queryByText("Einstellungen")).not.toBeInTheDocument();
    expect(screen.queryByText("Ausloggen")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Impressum"));
    await waitFor(() => {
      expect(screen.queryByText("Einloggen")).not.toBeInTheDocument();
    });
  });

  it("renders correct items when user is authenticated and navigates to settings when Einstellungen clicked", () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 1, name: "Test User" },
      isLoading: false,
      logout: mockLogout,
      login: mockLogin,
      setUser: mockSetUser,
    });

    renderWithAuth(<DropMenu />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.queryByText("Ausloggen")).toBeInTheDocument();
    expect(screen.queryByText("Einloggen")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Einstellungen"));
    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });

  it("navigates to login when user is null", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      login: mockLogin,
      logout: mockLogout,
      setUser: mockSetUser,
    });

    renderWithAuth(<DropMenu />);
    fireEvent.click(screen.getByRole("button"));

    fireEvent.click(screen.getByText("Einloggen"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
