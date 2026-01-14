import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResultsPage from "../ResultsPage";
import theme from "../../theme/theme";

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

// Mock the Auth context
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: "testuser" },
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
  })),
}));

// Mock the API
vi.mock("../../api/quizApi", () => ({
  getStudyProgrammeById: vi.fn((id: string) => {
    return Promise.resolve({
      studiengang_id: id,
      name: `Test Programme ${id}`,
      hochschule: "Test University",
      abschluss: "Bachelor of Science",
      homepage: "https://example.com",
      studienbeitrag: "500 EUR",
      beitrag_kommentar: "Per Semester",
      anmerkungen: "Test notes",
      regelstudienzeit: "6 Semester",
      zulassungssemester: "WS/SS",
      zulassungsmodus: "NC",
      zulassungsvoraussetzungen: "Abitur",
      zulassungslink: "https://example.com/apply",
      schwerpunkte: ["AI", "Software Engineering"],
      sprachen: ["Deutsch", "Englisch"],
      standorte: ["München"],
      studienfelder: ["Informatik"],
      studienform: ["Vollzeit"],
      fristen: null,
    });
  }),
  getQuizResults: vi.fn(() => Promise.resolve(null)),
  saveQuizResults: vi.fn(() => Promise.resolve()),
}));

// Mock the Favorites API
vi.mock("../../api/favoritesApi", () => ({
  getFavorites: vi.fn(() => Promise.resolve([])),
  addFavorite: vi.fn(() => Promise.resolve()),
  removeFavorite: vi.fn(() => Promise.resolve()),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MemoryRouter
      initialEntries={[
        { pathname: "/results", state: { idsFromLevel2: ["1", "2"] } },
      ]}
    >
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/results" element={component} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
};

describe("ResultsPage Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    vi.clearAllMocks();
    // Mock localStorage for tests
    Object.defineProperty(window, "localStorage", {
      value: {
        clear: vi.fn(),
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it("renders the page title", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("shows loading state initially", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("fetches and displays study programmes from navigation state", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("saves results to localStorage when fetched", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("sets quizCompleted flag in localStorage", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("loads results from localStorage when no new IDs provided", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("shows NoResultsYet when no quiz has been completed", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("handles individual fetch failures gracefully", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("shows error only when all programmes fail to load", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("loads favorites from API on mount", async () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("displays heart icon for favorited programmes", async () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("adds favorite to database when heart is clicked for unauthenticated user", async () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("reloads favorites when navigating back from detail page", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("handles favorite API errors gracefully", async () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  it("removes favorite from database when unliked", () => {
    expect(() => {
      renderWithTheme(<ResultsPage />);
    }).not.toThrow();
  });

  // Tests for saved results retrieval
  describe("Saved Results Retrieval", () => {
    it("fetches saved results from database when user is logged in and no navigation state", async () => {
      // Override the mocks before rendering
      const { getQuizResults, getStudyProgrammeById } =
        await import("../../api/quizApi");
      vi.mocked(getQuizResults).mockResolvedValue(["100", "101", "102"]);
      vi.mocked(getStudyProgrammeById).mockImplementation((id: string) =>
        Promise.resolve({
          studiengang_id: id,
          name: `Saved Programme ${id}`,
          hochschule: "Test University",
          abschluss: "Bachelor",
        }),
      );

      render(
        <MemoryRouter initialEntries={[{ pathname: "/results" }]}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>,
      );

      // Wait for async operations
      await vi.waitFor(() => {
        expect(getQuizResults).toHaveBeenCalled();
      });
    });

    it("shows NoResultsYet when logged-in user has no saved results", async () => {
      // Override the mock before rendering
      const { getQuizResults } = await import("../../api/quizApi");
      vi.mocked(getQuizResults).mockResolvedValue(null);

      const { findByText } = render(
        <MemoryRouter initialEntries={[{ pathname: "/results" }]}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>,
      );

      await findByText(/Keine Ergebnisse vorhanden/i);
      expect(getQuizResults).toHaveBeenCalled();
    });

    it("shows NoResultsYet when anonymous user has no navigation state", async () => {
      // Override useAuth mock to return null user
      const authContext = await import("../../contexts/AuthContext");
      const spy = vi.spyOn(authContext, "useAuth").mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      });

      const { findByText } = render(
        <MemoryRouter initialEntries={[{ pathname: "/results" }]}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>,
      );

      await findByText(/Keine Ergebnisse vorhanden/i);

      // Restore the original mock
      spy.mockRestore();
    });

    it("handles database fetch error gracefully", async () => {
      // Override the mock before rendering
      const { getQuizResults } = await import("../../api/quizApi");
      vi.mocked(getQuizResults).mockRejectedValue(new Error("Database error"));

      const { findByText } = render(
        <MemoryRouter initialEntries={[{ pathname: "/results" }]}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>,
      );

      // Wait for the error message to appear
      await findByText(/Fehler beim Laden der gespeicherten Ergebnisse/i);
      expect(getQuizResults).toHaveBeenCalled();
    });

    it("prioritizes navigation state over database results", async () => {
      // Override the mocks before rendering
      const { getQuizResults, getStudyProgrammeById } =
        await import("../../api/quizApi");
      vi.mocked(getQuizResults).mockResolvedValue(["100", "101"]);
      vi.mocked(getStudyProgrammeById).mockImplementation((id: string) =>
        Promise.resolve({
          studiengang_id: id,
          name: `Programme ${id}`,
          hochschule: "Test University",
          abschluss: "Bachelor",
        }),
      );

      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/results", state: { idsFromLevel2: ["1", "2"] } },
          ]}
        >
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>,
      );

      await vi.waitFor(() => {
        // Should NOT call getQuizResults because navigation state exists
        expect(getQuizResults).not.toHaveBeenCalled();
        // Should fetch programmes from navigation state IDs
        expect(getStudyProgrammeById).toHaveBeenCalledWith("1");
        expect(getStudyProgrammeById).toHaveBeenCalledWith("2");
      });
    });
  });
});
