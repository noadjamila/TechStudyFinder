import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import FavouritesEmpty from "../FavouritesEmpty";
import theme from "../../../theme/theme";

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: "testuser" },
    isLoading: false,
    isAuthenticated: true,
  })),
}));

describe("FavouritesEmpty", () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>{component}</MemoryRouter>
      </ThemeProvider>,
    );
  };

  it("should render the empty favorites message", () => {
    renderWithTheme(<FavouritesEmpty />);

    expect(
      screen.getByText("Noch keine Favoriten vorhanden."),
    ).toBeInTheDocument();
  });

  it("should render with MainLayout containing navigation", () => {
    renderWithTheme(<FavouritesEmpty />);

    // Check for navigation elements from MainLayout
    const logoElements = screen.getAllByAltText("Logo");
    expect(logoElements.length).toBeGreaterThan(0);
  });

  it("should display helpful text about adding favorites", () => {
    renderWithTheme(<FavouritesEmpty />);

    // Component should show message about empty state
    const messageElement = screen.getByText("Noch keine Favoriten vorhanden.");
    expect(messageElement).toBeVisible();
  });

  it("should render without crashing on mount", () => {
    expect(() => {
      renderWithTheme(<FavouritesEmpty />);
    }).not.toThrow();
  });
});
