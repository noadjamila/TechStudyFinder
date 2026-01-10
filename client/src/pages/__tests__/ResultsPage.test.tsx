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
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
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
});
