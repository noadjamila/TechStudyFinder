import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import Results from "../Results";
import theme from "../../../theme/theme";
import { StudyProgramme } from "../../../types/StudyProgramme.types";

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

// Mock Auth Context
vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: "testuser" },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));

// Mock Favorites API
vi.mock("../../../api/favoritesApi", () => ({
  getFavorites: vi.fn(() => Promise.resolve([])),
  addFavorite: vi.fn(() => Promise.resolve()),
  removeFavorite: vi.fn(() => Promise.resolve()),
}));

const mockStudyProgrammes: StudyProgramme[] = [
  {
    studiengang_id: "1",
    name: "Computer Science",
    hochschule: "Technical University Munich",
    abschluss: "Bachelor of Science",
    homepage: "https://example.com",
    studienbeitrag: "500 EUR",
    beitrag_kommentar: "Per Semester",
    anmerkungen: "",
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
  },
  {
    studiengang_id: "2",
    name: "Data Science",
    hochschule: "Ludwig-Maximilians-Universität München",
    abschluss: "Master of Science",
    homepage: "https://example.com",
    studienbeitrag: "0 EUR",
    beitrag_kommentar: "Keine Gebühren",
    anmerkungen: "",
    regelstudienzeit: "4 Semester",
    zulassungssemester: "WS",
    zulassungsmodus: "Frei",
    zulassungsvoraussetzungen: "Bachelor",
    zulassungslink: "https://example.com/apply",
    schwerpunkte: ["Machine Learning", "Statistics"],
    sprachen: ["Englisch"],
    standorte: ["München"],
    studienfelder: ["Datenwissenschaft"],
    studienform: ["Vollzeit"],
    fristen: null,
  },
  {
    studiengang_id: "3",
    name: "Software Engineering",
    hochschule: "Technical University Munich",
    abschluss: "Master of Science",
    homepage: "https://example.com",
    studienbeitrag: "500 EUR",
    beitrag_kommentar: "Per Semester",
    anmerkungen: "",
    regelstudienzeit: "4 Semester",
    zulassungssemester: "WS/SS",
    zulassungsmodus: "NC",
    zulassungsvoraussetzungen: "Bachelor Informatik",
    zulassungslink: "https://example.com/apply",
    schwerpunkte: ["Web Development", "Mobile Apps"],
    sprachen: ["Deutsch", "Englisch"],
    standorte: ["München"],
    studienfelder: ["Informatik"],
    studienform: ["Vollzeit"],
    fristen: null,
  },
  {
    studiengang_id: "4",
    name: "Information Systems",
    hochschule: "University of Cologne",
    abschluss: "Bachelor of Science",
    homepage: "https://example.com",
    studienbeitrag: "0 EUR",
    beitrag_kommentar: "Keine Gebühren",
    anmerkungen: "",
    regelstudienzeit: "6 Semester",
    zulassungssemester: "WS",
    zulassungsmodus: "NC",
    zulassungsvoraussetzungen: "Abitur",
    zulassungslink: "https://example.com/apply",
    schwerpunkte: ["Business Informatics"],
    sprachen: ["Deutsch"],
    standorte: ["Köln"],
    studienfelder: ["Wirtschaftsinformatik"],
    studienform: ["Vollzeit"],
    fristen: null,
  },
];

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </MemoryRouter>,
  );
};

describe("Results Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders the title", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);
    expect(screen.getByText("Meine Ergebnisse")).toBeInTheDocument();
  });

  it("displays all study programmes when no filters are applied", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Data Science")).toBeInTheDocument();
    expect(screen.getByText("Software Engineering")).toBeInTheDocument();
    expect(screen.getByText("Information Systems")).toBeInTheDocument();
  });

  it("shows empty state when no study programmes are provided", () => {
    renderWithTheme(<Results studyProgrammes={[]} />);
    expect(
      screen.getByText(/Keine Studiengänge gefunden/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Versuche, deine Quizantworten anzupassen/i),
    ).toBeInTheDocument();
  });

  it("displays university and degree information for each programme", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);
    expect(
      screen.getAllByText("Technical University Munich").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Bachelor of Science").length).toBeGreaterThan(
      0,
    );
  });

  it("renders filter dropdowns with accessibility labels", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    expect(screen.getByLabelText("Filter nach Standort")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter nach Abschluss")).toBeInTheDocument();
  });

  it("displays all programme names in the list", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Data Science")).toBeInTheDocument();
    expect(screen.getByText("Software Engineering")).toBeInTheDocument();
    expect(screen.getByText("Information Systems")).toBeInTheDocument();
  });

  it("toggles favorite state when clicking the favorite button", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const favoriteButtons = screen.getAllByLabelText("Zu Favoriten hinzufügen");
    const firstButton = favoriteButtons[0];

    fireEvent.click(firstButton);

    expect(
      screen.getByLabelText("Aus Favoriten entfernen"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Aus Favoriten entfernen"));

    expect(favoriteButtons[0]).toBeInTheDocument();
  });

  it("renders university and degree icons", () => {
    const { container } = renderWithTheme(
      <Results studyProgrammes={mockStudyProgrammes} />,
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("navigates to study programme detail page when card is clicked", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const firstCard = screen.getByRole("button", {
      name: /Details anzeigen für Computer Science/i,
    });
    fireEvent.click(firstCard);

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1", {
      state: { previousPage: expect.any(String) },
    });
  });

  it("navigates to correct detail page when different cards are clicked", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const dataCard = screen.getByRole("button", {
      name: /Details anzeigen für Data Science/i,
    });
    fireEvent.click(dataCard);

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/2", {
      state: { previousPage: expect.any(String) },
    });
  });

  it("makes cards keyboard accessible with Enter key", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const firstCard = screen.getByRole("button", {
      name: /Details anzeigen für Computer Science/i,
    });
    fireEvent.keyDown(firstCard, { key: "Enter" });

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1", {
      state: { previousPage: expect.any(String) },
    });
  });

  it("makes cards keyboard accessible with Space key", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const firstCard = screen.getByRole("button", {
      name: /Details anzeigen für Computer Science/i,
    });
    fireEvent.keyDown(firstCard, { key: " " });

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1", {
      state: { previousPage: expect.any(String) },
    });
  });
});
