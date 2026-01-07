import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
    localStorage.clear();
  });

  it("renders the page title", async () => {
    renderWithTheme(<ResultsPage />);
    await waitFor(() => {
      expect(screen.getByText("Meine Ergebnisse")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    renderWithTheme(<ResultsPage />);
    expect(screen.getByText("Lädt...")).toBeInTheDocument();
  });

  it("fetches and displays study programmes from navigation state", async () => {
    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Programme 1")).toBeInTheDocument();
    });
  });

  it("saves results to localStorage when fetched", async () => {
    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      const cached = localStorage.getItem("quizResults");
      expect(cached).not.toBeNull();
      const parsed = JSON.parse(cached!);
      expect(parsed).toHaveLength(2);
    });
  });

  it("sets quizCompleted flag in localStorage", async () => {
    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      expect(localStorage.getItem("quizCompleted")).toBe("true");
    });
  });

  it("loads results from localStorage when no new IDs provided", async () => {
    // Pre-populate localStorage
    const mockResults = [
      {
        studiengang_id: "cached1",
        name: "Cached Programme",
        hochschule: "Cached University",
        abschluss: "Master",
        homepage: "https://example.com",
        studienbeitrag: "0 EUR",
        beitrag_kommentar: "",
        anmerkungen: "",
        regelstudienzeit: "4 Semester",
        zulassungssemester: "WS",
        zulassungsmodus: "Frei",
        zulassungsvoraussetzungen: "Bachelor",
        zulassungslink: "https://example.com",
        schwerpunkte: [],
        sprachen: ["Deutsch"],
        standorte: ["Berlin"],
        studienfelder: ["Informatik"],
        studienform: ["Vollzeit"],
        fristen: null,
      },
    ];
    localStorage.setItem("quizResults", JSON.stringify(mockResults));
    localStorage.setItem("quizCompleted", "true");

    render(
      <MemoryRouter initialEntries={["/results"]}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Cached Programme")).toBeInTheDocument();
    });
  });

  it("shows NoResultsYet when no quiz has been completed", async () => {
    render(
      <MemoryRouter initialEntries={["/results"]}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Starte jetzt das Quiz/i)).toBeInTheDocument();
      expect(
        screen.getByText("Keine Ergebnisse vorhanden."),
      ).toBeInTheDocument();
    });
  });

  it("handles individual fetch failures gracefully", async () => {
    const { getStudyProgrammeById } = await import("../../api/quizApi");
    vi.mocked(getStudyProgrammeById).mockImplementation((id: string) => {
      if (id === "1") {
        return Promise.resolve({
          studiengang_id: "1",
          name: "Successful Programme",
          hochschule: "Test University",
          abschluss: "Bachelor",
          homepage: "https://example.com",
          studienbeitrag: "500 EUR",
          beitrag_kommentar: null,
          anmerkungen: null,
          regelstudienzeit: "6 Semester",
          zulassungssemester: null,
          zulassungsmodus: null,
          zulassungsvoraussetzungen: null,
          zulassungslink: null,
          schwerpunkte: null,
          sprachen: null,
          standorte: null,
          studienfelder: null,
          studienform: null,
        });
      } else if (id === "2") {
        return Promise.resolve(null); // 404 - not found
      } else {
        return Promise.reject(new Error("Network error")); // 500 error
      }
    });

    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      // Should display the one successful programme
      expect(screen.getByText("Successful Programme")).toBeInTheDocument();
    });
  });

  it("shows error only when all programmes fail to load", async () => {
    const { getStudyProgrammeById } = await import("../../api/quizApi");
    vi.mocked(getStudyProgrammeById).mockRejectedValue(
      new Error("Network error"),
    );

    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Fehler beim Laden der Studiengänge"),
      ).toBeInTheDocument();
    });
  });
});
