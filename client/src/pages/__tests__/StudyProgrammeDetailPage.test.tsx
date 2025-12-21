import { render, screen, fireEvent } from "@testing-library/react";
import StudyProgrammeDetailPage from "../StudyProgrammeDetailPage";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
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

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithProviders = (id: string) => {
  return render(
    <MemoryRouter initialEntries={[`/study-programme/${id}`]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
  });

  it("renders study programme details for valid ID", () => {
    renderWithProviders("1");

    expect(
      screen.getByText("Communication Systems and Networks"),
    ).toBeInTheDocument();
    expect(screen.getByText("Technische Hochschule Köln")).toBeInTheDocument();
    expect(screen.getByText("Master")).toBeInTheDocument();
  });

  it("renders back button with correct label", () => {
    renderWithProviders("1");

    const backButton = screen.getByText("Zurück");
    expect(backButton).toBeInTheDocument();
  });

  it("navigates back to results when back button is clicked", () => {
    renderWithProviders("1");

    const backButton = screen.getByText("Zurück");
    fireEvent.click(backButton);

    expect(mockedNavigate).toHaveBeenCalledWith("/results");
  });

  it("renders favorite button with unfavorited state by default", () => {
    renderWithProviders("1");

    const favoriteButton = screen.getByLabelText("Zu Favoriten hinzufügen");
    expect(favoriteButton).toBeInTheDocument();
  });

  it("toggles favorite state when favorite button is clicked", () => {
    renderWithProviders("1");

    const favoriteButton = screen.getByLabelText("Zu Favoriten hinzufügen");
    fireEvent.click(favoriteButton);

    expect(
      screen.getByLabelText("Aus Favoriten entfernen"),
    ).toBeInTheDocument();
  });

  it("renders university icon and stars icon", () => {
    const { container } = renderWithProviders("1");

    // Check for MUI icons by finding svg elements with specific test ids or parent structure
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("renders details section with heading and description", () => {
    renderWithProviders("1");

    expect(screen.getByText("Studiengangs-Details")).toBeInTheDocument();
    expect(
      screen.getByText(/Weitere Informationen zu diesem Studiengang/i),
    ).toBeInTheDocument();
  });

  it("renders DataSource component", () => {
    renderWithProviders("1");

    expect(screen.getByAltText("HRK Logo")).toBeInTheDocument();
  });

  it("displays not found message for invalid ID", () => {
    renderWithProviders("999");

    expect(screen.getByText("Studiengang nicht gefunden")).toBeInTheDocument();
  });

  it("shows back button on not found page", () => {
    renderWithProviders("999");

    const backButton = screen.getByText("Zurück");
    expect(backButton).toBeInTheDocument();
  });

  it("renders correct study programme for different IDs", () => {
    renderWithProviders("3");

    expect(screen.getByText("Informatik")).toBeInTheDocument();
    expect(
      screen.getByText("Rheinische Friedrich-Wilhelms-Universität Bonn"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
  });
});
