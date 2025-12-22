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

const mockStudyProgrammes: StudyProgramme[] = [
  {
    id: 1,
    name: "Computer Science",
    university: "Technical University Munich",
    degree: "Bachelor of Science",
  },
  {
    id: 2,
    name: "Data Science",
    university: "Ludwig-Maximilians-Universität München",
    degree: "Master of Science",
  },
  {
    id: 3,
    name: "Software Engineering",
    university: "Technical University Munich",
    degree: "Master of Science",
  },
  {
    id: 4,
    name: "Information Systems",
    university: "University of Cologne",
    degree: "Bachelor of Science",
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
    expect(screen.getByText("Keine Studiengänge gefunden")).toBeInTheDocument();
    expect(
      screen.getByText("Versuchen Sie, Ihre Quizantworten anzupassen"),
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

    expect(
      screen.getByLabelText("Filter nach Universität oder Hochschule"),
    ).toBeInTheDocument();
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

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1");
  });

  it("navigates to correct detail page when different cards are clicked", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const dataCard = screen.getByRole("button", {
      name: /Details anzeigen für Data Science/i,
    });
    fireEvent.click(dataCard);

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/2");
  });

  it("makes cards keyboard accessible with Enter key", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const firstCard = screen.getByRole("button", {
      name: /Details anzeigen für Computer Science/i,
    });
    fireEvent.keyDown(firstCard, { key: "Enter" });

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1");
  });

  it("makes cards keyboard accessible with Space key", () => {
    renderWithTheme(<Results studyProgrammes={mockStudyProgrammes} />);

    const firstCard = screen.getByRole("button", {
      name: /Details anzeigen für Computer Science/i,
    });
    fireEvent.keyDown(firstCard, { key: " " });

    expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1");
  });
});
