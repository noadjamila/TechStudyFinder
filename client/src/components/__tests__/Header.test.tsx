import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoMenu from "../Header";
import "@testing-library/jest-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { vi } from "vitest";

vi.mock("../../api/authApi", () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
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

  it("renders the Logo and Menu Icon", () => {
    renderWithAuth(<LogoMenu />);

    const logo = screen.getByAltText(/Logo/i);
    expect(logo).toBeInTheDocument();

    const menuIcon = screen.getByRole("button");
    expect(menuIcon).toBeInTheDocument();
  });

  it("opens and closes the menu", () => {
    renderWithAuth(<LogoMenu />);

    const menuIcon = screen.getByRole("button");
    fireEvent.click(menuIcon);
    expect(screen.getAllByRole("menuitem").length).toBeGreaterThan(0);

    // Menü schließen durch Menü-Eintrag
    fireEvent.click(screen.getByText("Impressum"));

    expect(screen.queryAllByRole("menuitem")).toHaveLength(0);

    // Re-query for menu items after closing the menu
    expect(screen.queryAllByRole("menuitem").length).toBe(0);
  });
});
