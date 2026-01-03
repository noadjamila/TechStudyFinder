import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StudyProgrammeDetailPage from "../StudyProgrammeDetailPage";
import theme from "../../theme/theme";
import * as quizApi from "../../api/quizApi";

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

vi.mock("../../api/quizApi");

const mockProgramme = {
  studiengang_id: "12345",
  name: "Informatik",
  hochschule: "Technische Universität Berlin",
  abschluss: "Bachelor of Science",
  homepage:
    "https://www.tu.berlin/studieren/studienangebot/gesamtes-studienangebot/studiengang/informatik-b-sc",
  studienbeitrag: "Keine Studiengebühren",
  beitrag_kommentar: "Semesterbeitrag ca. 315 EUR (inkl. Semesterticket)",
  anmerkungen:
    "Der Bachelorstudiengang Informatik vermittelt grundlegende Kenntnisse und Methoden der Informatik sowie die Fähigkeit, diese anzuwenden.",
  regelstudienzeit: "6 Semester",
  zulassungssemester: "Wintersemester",
  zulassungsmodus: "Zulassungsbeschränkt (NC)",
  zulassungsvoraussetzungen:
    "Allgemeine Hochschulreife oder Fachhochschulreife",
  zulassungslink: "https://www.tu.berlin/studieren/bewerbung-zulassung",
  schwerpunkte: [
    "Algorithmik",
    "Software Engineering",
    "Künstliche Intelligenz",
    "Datenbanken",
  ],
  sprachen: ["Deutsch", "Englisch"],
  standorte: ["Berlin"],
  studienfelder: ["Informatik", "Mathematik"],
  studienform: ["Vollzeit", "Teilzeit"],
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
  beforeEach(() => {
    mockedNavigate.mockClear();
    vi.mocked(quizApi.getStudyProgrammeById).mockResolvedValue(mockProgramme);
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  describe("Loading State", () => {
    it("shows loading state initially", () => {
      renderWithTheme();
      expect(screen.getByText("Lädt...")).toBeInTheDocument();
    });
  });

  describe("Content Rendering", () => {
    it("renders programme name as main heading", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Informatik", level: 1 }),
        ).toBeInTheDocument();
      });
    });

    it("renders university name with location icon", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(
          screen.getByText("Technische Universität Berlin"),
        ).toBeInTheDocument();
      });
    });

    it("renders degree with stars icon", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
      });
    });

    it("renders back button", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Zurück")).toBeInTheDocument();
      });
    });

    it("navigates back to results when back button is clicked", async () => {
      renderWithTheme();
      await waitFor(() => {
        const backButton = screen.getByText("Zurück");
        fireEvent.click(backButton);
        expect(mockedNavigate).toHaveBeenCalledWith("/results");
      });
    });
  });

  describe("Sections Rendering", () => {
    it("renders Allgemeine Informationen section", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(
          screen.getByText("Allgemeine Informationen"),
        ).toBeInTheDocument();
      });
    });

    it("renders studienform information", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText(/Vollzeit, Teilzeit/i)).toBeInTheDocument();
      });
    });

    it("renders regelstudienzeit", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("6 Semester")).toBeInTheDocument();
      });
    });

    it("renders standorte", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Berlin")).toBeInTheDocument();
      });
    });

    it("renders sprachen", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Deutsch, Englisch")).toBeInTheDocument();
      });
    });

    it("renders Schwerpunkte section with chips", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Schwerpunkte")).toBeInTheDocument();
        expect(screen.getByText("Algorithmik")).toBeInTheDocument();
        expect(screen.getByText("Software Engineering")).toBeInTheDocument();
        expect(screen.getByText("Künstliche Intelligenz")).toBeInTheDocument();
        expect(screen.getByText("Datenbanken")).toBeInTheDocument();
      });
    });

    it("renders Studienfelder section with chips", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Studienfelder")).toBeInTheDocument();
        expect(screen.getByText("Mathematik")).toBeInTheDocument();
      });
    });

    it("renders Zulassung accordion", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Zulassung")).toBeInTheDocument();
      });
    });

    it("expands Zulassung accordion when clicked", async () => {
      renderWithTheme();
      await waitFor(() => {
        const zulassungHeader = screen.getByText("Zulassung");
        fireEvent.click(zulassungHeader);
        expect(screen.getByText("Zulassungssemester:")).toBeInTheDocument();
        expect(screen.getByText("Wintersemester")).toBeInTheDocument();
      });
    });

    it("renders Kosten accordion", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Kosten")).toBeInTheDocument();
      });
    });

    it("expands Kosten accordion when clicked", async () => {
      renderWithTheme();
      await waitFor(() => {
        const kostenHeader = screen.getByText("Kosten");
        fireEvent.click(kostenHeader);
        expect(screen.getByText("Studienbeitrag:")).toBeInTheDocument();
        expect(screen.getByText("Keine Studiengebühren")).toBeInTheDocument();
      });
    });

    it("renders Anmerkungen section", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(screen.getByText("Anmerkungen")).toBeInTheDocument();
        expect(
          screen.getByText(/Der Bachelorstudiengang Informatik vermittelt/i),
        ).toBeInTheDocument();
      });
    });

    it("renders homepage link", async () => {
      renderWithTheme();
      await waitFor(() => {
        const link = screen.getByText("Zur Studiengangs-Homepage →");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute(
          "href",
          "https://www.tu.berlin/studieren/studienangebot/gesamtes-studienangebot/studiengang/informatik-b-sc",
        );
      });
    });
  });

  describe("Favorite Functionality", () => {
    it("renders favorite button", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(
          screen.getByLabelText("Zu Favoriten hinzufügen"),
        ).toBeInTheDocument();
      });
    });

    it("toggles favorite state when clicked", async () => {
      renderWithTheme();
      await waitFor(() => {
        const favoriteButton = screen.getByLabelText("Zu Favoriten hinzufügen");
        fireEvent.click(favoriteButton);
        expect(
          screen.getByLabelText("Aus Favoriten entfernen"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Responsive Design", () => {
    it("renders data source component", async () => {
      renderWithTheme();
      await waitFor(() => {
        // DataSource component should be rendered
        expect(screen.getByText(/Hochschulkompass/i)).toBeInTheDocument();
      });
    });
  });

  describe("Scroll Behavior", () => {
    it("scrolls to top when component mounts", async () => {
      renderWithTheme();
      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });
    });
  });
});
