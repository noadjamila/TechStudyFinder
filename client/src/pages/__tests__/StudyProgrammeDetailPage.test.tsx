import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StudyProgrammeDetailPage from "../StudyProgrammeDetailPage";
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

// Mock APIs
vi.mock("../../api/quizApi", () => ({
  getStudyProgrammeById: vi.fn(),
}));

vi.mock("../../api/favoritesApi", () => ({
  getFavorites: vi.fn(),
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
}));

// Mock window.matchMedia for MUI useMediaQuery
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockProgramme = {
  studiengang_id: "12345",
  name: "Informatik",
  hochschule: "Technische Universität Berlin",
  abschluss: "Bachelor of Science",
  homepage: "https://www.tu.berlin/...",
  studienbeitrag: "Keine Studiengebühren",
  anmerkungen: "Der Bachelorstudiengang...",
  regelstudienzeit: "6 Semester",
  zulassungssemester: "Wintersemester",
  zulassungsmodus: "Zulassungsbeschränkt (NC)",
  zulassungsvoraussetzungen: "Abitur",
  schwerpunkte: ["Software Engineering"],
  sprachen: ["Deutsch"],
  standorte: ["Berlin"],
  studienfelder: ["Informatik"],
  studienform: ["Vollzeit", "Teilzeit"],
  fristen: null,
};

const renderWithTheme = (initialRoute = "/study-programme/12345") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/study-programme/:id"
            element={<StudyProgrammeDetailPage />}
          />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
};

describe("StudyProgrammeDetailPage Component", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Get mocked functions and set them up
    const quizApi = await import("../../api/quizApi");
    const favoritesApi = await import("../../api/favoritesApi");

    vi.mocked(quizApi.getStudyProgrammeById).mockResolvedValue(mockProgramme);
    vi.mocked(favoritesApi.getFavorites).mockResolvedValue([]);

    window.scrollTo = vi.fn();
  });

  it("shows loading state initially", () => {
    renderWithTheme();
    expect(screen.getByText("Lädt...")).toBeInTheDocument();
  });

  it("renders programme details after loading", async () => {
    renderWithTheme();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Informatik" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Technische Universität Berlin"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", async () => {
    renderWithTheme();

    await waitFor(() => {
      const backButton = screen.getByRole("button", { name: /zurück/i });
      fireEvent.click(backButton);
    });

    // Fix: Your component uses navigate(-1), so we expect -1
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("renders chips for studienform", async () => {
    renderWithTheme();

    await waitFor(() => {
      // Look for text within the specific section
      expect(screen.getByText(/Vollzeit, Teilzeit/i)).toBeInTheDocument();
    });
  });
});
