import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogoMenu from "../logo-menu/LogoMenu";
import "@testing-library/jest-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { vi } from "vitest";

vi.mock("../../api/authApi", () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ id: 1, username: "testuser" }),
  login: vi.fn(),
  logout: vi.fn(),
}));

const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("LogoMenu Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Logo and Menu Icon", async () => {
    renderWithAuth(<LogoMenu />);

    const logo = screen.getByAltText(/Logo/i);
    expect(logo).toBeInTheDocument();

    // Wait for the loading to complete and menu button to appear
    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it("opens and closes the menu", async () => {
    renderWithAuth(<LogoMenu />);

    // Wait for the menu button to appear
    await waitFor(() => {
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
    });

    const menuIcon = screen.getAllByRole("button")[0];
    fireEvent.click(menuIcon);

    await waitFor(() => {
      expect(screen.getAllByRole("menuitem").length).toBeGreaterThan(0);
    });

    // Menü schließen durch Menü-Eintrag
    fireEvent.click(screen.getByText("Impressum"));

    await waitFor(() => {
      expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
    });
  });
});
