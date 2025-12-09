import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import Results from "../Results";
import theme from "../../../theme/theme";
import { StudyProgramme } from "../../../types/StudyProgramme.types";

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
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("Results Component", () => {
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

    const favoriteButtons = screen.getAllByLabelText("Add to favorites");
    const firstButton = favoriteButtons[0];

    fireEvent.click(firstButton);

    expect(screen.getByLabelText("Remove from favorites")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Remove from favorites"));

    expect(favoriteButtons[0]).toBeInTheDocument();
  });

  it("renders university and degree icons", () => {
    const { container } = renderWithTheme(
      <Results studyProgrammes={mockStudyProgrammes} />,
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });
});
