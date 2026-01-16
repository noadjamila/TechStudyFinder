import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResultsPage from "../ResultsPage";
import theme from "../../theme/theme";
import * as persist from "../../session/persistQuizSession";

const mockedNavigate = vi.fn();
vi.mock("../../session/persistQuizSession", () => {
  let cache: any = null;

  return {
    loadQuizResults: vi.fn(async () => cache),
    saveQuizResults: vi.fn(async (results) => {
      cache = results;
    }),
  };
});
vi.mock("../../api/quizApi", () => ({
  getStudyProgrammeById: vi.fn(async (id: string) => ({
    studiengang_id: id,
    name: `Test Programme ${id}`,
  })),
}));

vi.mock("../../components/quiz/Results", () => ({
  __esModule: true,
  default: ({ studyProgrammes }: any) => (
    <div>
      <h1>Meine Ergebnisse</h1>
      {studyProgrammes.map((p: any) => (
        <div key={p.studiengang_id}>{p.name}</div>
      ))}
    </div>
  ),
}));

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

beforeEach(async () => {
  mockedNavigate.mockClear();

  const api = await import("../../api/quizApi");
  vi.mocked(api.getStudyProgrammeById).mockImplementation(
    async (id: string) =>
      ({
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
      }) as any,
  );
});

const renderWithTheme = (
  component: React.ReactElement,
  entry: { pathname: string; state?: any } = {
    pathname: "/results",
    state: { resultIds: ["1", "2"] },
  },
) => {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/results" element={component} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe("ResultsPage Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders the page title", async () => {
    renderWithTheme(<ResultsPage />);
    expect(await screen.findByText("Meine Ergebnisse")).toBeInTheDocument();
  });

  test("shows loading state initially", async () => {
    const api = await import("../../api/quizApi");
    vi.mocked(api.getStudyProgrammeById).mockImplementation(
      () => new Promise(() => {}) as any,
    );

    renderWithTheme(<ResultsPage />, {
      pathname: "/results",
      state: { resultIds: ["1"] },
    });

    expect(await screen.findByText(/lädt/i)).toBeInTheDocument();
  });

  it("fetches and displays study programmes from navigation state", async () => {
    renderWithTheme(<ResultsPage />, {
      pathname: "/results",
      state: { resultIds: ["1", "2"] },
    });

    expect(await screen.findByText("Test Programme 1")).toBeInTheDocument();
    expect(await screen.findByText("Test Programme 2")).toBeInTheDocument();
  });

  it("saves results to IndexedDB when fetched", async () => {
    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      expect(vi.mocked(persist.saveQuizResults)).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ studiengang_id: "1" }),
          expect.objectContaining({ studiengang_id: "2" }),
        ]),
      );
    });
  });

  it("loads results from IndexedDB when no new IDs provided", async () => {
    vi.mocked(persist.loadQuizResults).mockResolvedValueOnce([
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
    ] as any);

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
