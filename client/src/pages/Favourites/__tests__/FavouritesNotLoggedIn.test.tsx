import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import FavouritesNotLoggedIn from "../FavouritesNotLoggedIn";
import theme from "../../../theme/theme";

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  })),
}));

describe("FavouritesNotLoggedIn", () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>{component}</MemoryRouter>
      </ThemeProvider>,
    );
  };

  it("should render the login prompt message", () => {
    renderWithTheme(<FavouritesNotLoggedIn />);

    expect(
      screen.getByText("Logge dich ein, um deine Favoriten zu sehen."),
    ).toBeInTheDocument();
  });

  it("should render with MainLayout containing navigation", () => {
    renderWithTheme(<FavouritesNotLoggedIn />);

    // Check for navigation elements from MainLayout
    const logoElements = screen.getAllByAltText("Logo");
    expect(logoElements.length).toBeGreaterThan(0);
  });

  it("should display helpful message about authentication requirement", () => {
    renderWithTheme(<FavouritesNotLoggedIn />);

    const messageElement = screen.getByText(
      "Logge dich ein, um deine Favoriten zu sehen.",
    );
    expect(messageElement).toBeVisible();
  });

  it("should render without crashing on mount", () => {
    expect(() => {
      renderWithTheme(<FavouritesNotLoggedIn />);
    }).not.toThrow();
  });
});
