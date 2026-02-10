import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResultsPage from "../ResultsPage";
import theme from "../../theme/theme";
import * as persist from "../../session/persistQuizResults";

const mockedNavigate = vi.fn();
vi.mock("../../session/persistQuizResults", () => {
  let cache: any = null;

  return {
    loadQuizResults: vi.fn(async () => cache),
    saveQuizResults: vi.fn(async (results) => {
      cache = results;
    }),
  };
});
const mockUseAuth = vi.fn();

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));
vi.mock("../../api/quizApi", () => ({
  getStudyProgrammeById: vi.fn(async (id: string) => ({
    studiengang_id: id,
    name: `Test Programme ${id}`,
  })),
  getStudyProgrammesByIds: vi.fn(async (ids: string[]) =>
    ids.map((id) => ({
      studiengang_id: id,
      name: `Test Programme ${id}`,
      hochschule: "Test University",
      abschluss: "Bachelor",
      homepage: null,
      studienbeitrag: null,
      beitrag_kommentar: null,
      anmerkungen: null,
      regelstudienzeit: null,
      zulassungssemester: null,
      zulassungsmodus: null,
      zulassungsvoraussetzungen: null,
      zulassungslink: null,
      schwerpunkte: null,
      sprachen: null,
      standorte: null,
      studienfelder: null,
      studienform: null,
      fristen: null,
    })),
  ),
  getQuizResults: vi.fn(async () => null),
}));

vi.mock("../../components/quiz/Results", () => ({
  __esModule: true,
  default: ({ studyProgrammes }: any) => (
    <div>
      <h1>Deine Ergebnisse</h1>
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

/** Mock the Auth context
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: "testuser" },
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
    setUser: vi.fn(),
  })),
}));
  **/

beforeEach(async () => {
  mockedNavigate.mockClear();
  vi.clearAllMocks();
  let store: Record<string, string> = {};
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: vi.fn((k: string) => store[k] ?? null),
      setItem: vi.fn((k: string, v: string) => {
        store[k] = String(v);
      }),
      removeItem: vi.fn((k: string) => {
        delete store[k];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    },
    writable: true,
  });

  mockUseAuth.mockReturnValue({
    user: { id: 1, username: "testuser" },
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
  });

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
  vi.mocked(api.getStudyProgrammesByIds).mockImplementation(
    async (ids: string[]) =>
      ids.map((id) => ({
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
      })) as any,
  );
});

const renderWithTheme = (
  component: React.ReactElement,
  entry: { pathname: string; state?: any; isLoading?: boolean } = {
    pathname: "/results",
    state: { results: ["1", "2"] },
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
  it("renders the page title", async () => {
    renderWithTheme(<ResultsPage />);
    expect(await screen.findByText("Deine Ergebnisse")).toBeInTheDocument();
  });

  test("shows loading state initially", async () => {
    const api = await import("../../api/quizApi");
    vi.mocked(api.getStudyProgrammeById).mockImplementation(
      () => new Promise(() => {}) as any,
    );

    renderWithTheme(<ResultsPage />, {
      pathname: "/results",
      state: { results: ["1"] },
      isLoading: true,
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("fetches and displays study programmes from navigation state", async () => {
    renderWithTheme(<ResultsPage />, {
      pathname: "/results",
      state: { results: ["1", "2"] },
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
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setUser: vi.fn(),
    });
    window.sessionStorage.setItem("activeQuizResults", "1");
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
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      setUser: vi.fn(),
    });
    window.sessionStorage.removeItem("activeQuizResults");
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
      expect(screen.getByText(/Deine Ergebnisse/i)).toBeInTheDocument();
    });
  });

  it("handles fetch with partial data gracefully", async () => {
    const { getStudyProgrammesByIds } = await import("../../api/quizApi");
    // Mock bulk fetch to return only some programmes (simulating DB only finding some IDs)
    vi.mocked(getStudyProgrammesByIds).mockResolvedValue([
      {
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
        fristen: null,
      },
    ]);

    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      // Should display the successful programme
      expect(screen.getByText("Successful Programme")).toBeInTheDocument();
    });
  });

  it("shows error when bulk fetch fails", async () => {
    const { getStudyProgrammesByIds } = await import("../../api/quizApi");
    vi.mocked(getStudyProgrammesByIds).mockRejectedValue(
      new Error("Network error"),
    );

    renderWithTheme(<ResultsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Unerwarteter Fehler beim Laden der Ergebnisse"),
      ).toBeInTheDocument();
    });
  });

  it("preserves result order even when database returns programmes in different order", async () => {
    const { getStudyProgrammesByIds } = await import("../../api/quizApi");

    // Mock bulk fetch to return programmes in reverse order (simulating DB behavior)
    vi.mocked(getStudyProgrammesByIds).mockImplementation(
      async (ids: string[]) => {
        const programmes = ids.map((id) => ({
          studiengang_id: id,
          name: `Programme ${id}`,
          hochschule: "Test University",
          abschluss: "Bachelor",
          homepage: null,
          studienbeitrag: null,
          beitrag_kommentar: null,
          anmerkungen: null,
          regelstudienzeit: null,
          zulassungssemester: null,
          zulassungsmodus: null,
          zulassungsvoraussetzungen: null,
          zulassungslink: null,
          schwerpunkte: null,
          sprachen: null,
          standorte: null,
          studienfelder: null,
          studienform: null,
          fristen: null,
        }));
        // Return in reverse order
        return programmes.reverse();
      },
    );

    renderWithTheme(<ResultsPage />, {
      pathname: "/results",
      state: { results: ["1", "2", "3"] },
    });

    await waitFor(() => {
      expect(vi.mocked(persist.saveQuizResults)).toHaveBeenCalled();
    });

    // Verify the saved results maintain the original order (1, 2, 3), not reversed
    const savedResults = vi.mocked(persist.saveQuizResults).mock.calls[0][0];
    expect(savedResults[0].studiengang_id).toBe("1");
    expect(savedResults[1].studiengang_id).toBe("2");
    expect(savedResults[2].studiengang_id).toBe("3");
  });

  // Tests for saved results retrieval
  describe("Saved Results Retrieval", () => {
    it("fetches saved results from database when user is logged in and no navigation state", async () => {
      // Override the mocks before rendering
      const { getQuizResults, getStudyProgrammeById } =
        await import("../../api/quizApi");
      vi.mocked(getQuizResults).mockResolvedValue([
        { studiengang_id: "100", similarity: 0.95 },
        { studiengang_id: "101", similarity: 0.88 },
        { studiengang_id: "102", similarity: 0.76 },
      ]);
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

      await findByText(/Starte jetzt das Quiz/i);
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

      await findByText(/Starte jetzt das Quiz/i);

      // Restore the original mock
      spy.mockRestore();
    });

    it("waits for authentication to load before fetching results", async () => {
      // Override useAuth mock to return loading state
      const api = await import("../../api/quizApi");
      mockUseAuth.mockReturnValue({
        user: null,
        isLoading: true,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      });

      renderWithTheme(<ResultsPage />, {
        pathname: "/results",
        state: { results: ["1"] },
        isLoading: true,
      });

      // Should show loading state
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

      expect(api.getQuizResults).not.toHaveBeenCalled();
    });

    it("handles database fetch error gracefully", async () => {
      const api = await import("../../api/quizApi");
      vi.mocked(api.getQuizResults).mockRejectedValue(
        new Error("Datenbankfehler"),
      );
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: "testuser" },
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={[{ pathname: "/results" }]}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>,
      );

      await waitFor(
        () => {
          expect(
            screen.getByText(/Unerwarteter Fehler beim Laden der Ergebnisse/i),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
      expect(api.getQuizResults).toHaveBeenCalled();
    });

    it("prioritizes navigation state over database results", async () => {
      // Override the mocks before rendering
      const api = await import("../../api/quizApi");
      vi.mocked(api.getQuizResults).mockResolvedValue([
        { studiengang_id: "100", similarity: 0.92 },
        { studiengang_id: "101", similarity: 0.85 },
      ]);
      vi.mocked(api.getStudyProgrammeById).mockImplementation(
        async (id: string) =>
          ({
            studiengang_id: id,
            name: `Programme ${id}`,
            hochschule: "Test University",
            abschluss: "Bachelor",
          }) as any,
      );

      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/results", state: { results: ["1", "2"] } },
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
        expect(api.getQuizResults).not.toHaveBeenCalled();
        // Should fetch programmes using bulk API
        expect(api.getStudyProgrammesByIds).toHaveBeenCalledWith(
          expect.arrayContaining(["1", "2"]),
        );
      });
    });
  });
});
