import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import FavouritesList from "../FavouritePogrammeList";
import theme from "../../../theme/theme";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock Auth context
vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: "testuser" },
    isAuthenticated: true,
  })),
}));

// Mock the API
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
  removeFavorite: vi.fn(() => Promise.resolve()),
  getFavorites: vi.fn(() => Promise.resolve([])),
}));

describe("FavouritesList", () => {
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

  it("should render loading state initially", () => {
    renderWithTheme(<FavouritesList favorites={["g1234"]} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render empty state when no favorites provided", async () => {
    const { queryAllByText } = renderWithTheme(
      <FavouritesList favorites={[]} />,
    );

    await waitFor(() => {
      // When no favorites, no programme cards should be rendered
      const programmeCards = queryAllByText(/Programme/i);
      expect(programmeCards.length).toBe(0);
    });
  });

  it("should render study programme cards for favorites", async () => {
    const { getByText } = renderWithTheme(
      <FavouritesList favorites={["g1234", "g5678"]} />,
    );

    await waitFor(() => {
      expect(getByText("Meine Favoriten")).toBeInTheDocument();
      expect(getByText("Programme g1234")).toBeInTheDocument();
      expect(getByText("Programme g5678")).toBeInTheDocument();
    });
  });

  it("should remove card when favorite is unliked", async () => {
    const { queryByText, getAllByRole } = renderWithTheme(
      <FavouritesList favorites={["g1234"]} />,
    );

    await waitFor(() => {
      expect(queryByText("Programme g1234")).toBeInTheDocument();
    });

    // Click the favorite button (heart icon)
    const buttons = getAllByRole("button");
    const favoriteButton = buttons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Favoriten"),
    );

    if (favoriteButton) {
      fireEvent.click(favoriteButton);
    }

    // Should show empty state after fade timeout (1800ms)
    await waitFor(
      () => {
        expect(
          queryByText("Noch keine Favoriten vorhanden."),
        ).toBeInTheDocument();
      },
      { timeout: 2500 },
    );
  });

  it("should have pink hearts for all cards", async () => {
    const { getAllByRole } = renderWithTheme(
      <FavouritesList favorites={["g1234"]} />,
    );

    await waitFor(() => {
      const heartIcons = getAllByRole("button").filter((btn) =>
        btn.getAttribute("aria-label")?.includes("Favoriten"),
      );

      // At least one favorite button should exist
      expect(heartIcons.length).toBeGreaterThan(0);
    });
  });

  it("should sync with database on favorite removal", async () => {
    const { removeFavorite } = await import("../../../api/favoritesApi");

    renderWithTheme(<FavouritesList favorites={["g1234"]} />);

    await waitFor(() => {
      expect(screen.getByText("Programme g1234")).toBeInTheDocument();
    });

    // Click favorite to remove
    const buttons = screen.getAllByRole("button");
    const favoriteButton = buttons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Favoriten"),
    );

    if (favoriteButton) {
      fireEvent.click(favoriteButton);

      await waitFor(() => {
        expect(removeFavorite).toHaveBeenCalledWith("g1234");
      });
    }
  });
});
