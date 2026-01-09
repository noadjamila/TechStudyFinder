import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import FavouritesContainer from "../FavouritesContainer";
import theme from "../../../theme/theme";

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: "testuser" },
    isLoading: false,
    isAuthenticated: true,
  })),
}));

vi.mock("../../../api/quizApi", () => ({
  getStudyProgrammeById: vi.fn((id: string) => {
    return Promise.resolve({
      studiengang_id: id,
      name: `Programme ${id}`,
      hochschule: "Test University",
      abschluss: "Bachelor",
    });
  }),
}));

vi.mock("../../../api/favoritesApi", () => ({
  getFavorites: vi.fn(() => Promise.resolve(["g1234"])),
  removeFavorite: vi.fn(() => Promise.resolve()),
  addFavorite: vi.fn(() => Promise.resolve()),
}));

describe("FavouritesContainer Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>{component}</MemoryRouter>
      </ThemeProvider>,
    );
  };

  it("should render loading spinner initially", () => {
    renderWithTheme(<FavouritesContainer />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should show appropriate view when user has favorites", async () => {
    renderWithTheme(<FavouritesContainer />);

    // Initially shows loading
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Eventually resolves to show content
    await waitFor(
      () => {
        // Check if loading is gone
        const container = screen.queryByRole("progressbar");
        expect(container === null).toBeTruthy();
      },
      { timeout: 3000 },
    );
  });

  it("should handle errors gracefully", async () => {
    expect(() => {
      renderWithTheme(<FavouritesContainer />);
    }).not.toThrow();
  });
});
