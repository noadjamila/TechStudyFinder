import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import NoResultsYet from "../NoResultsYet";
import theme from "../../../theme/theme";

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

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </MemoryRouter>,
  );
};

describe("NoResultsYet Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders the main heading", () => {
    renderWithTheme(<NoResultsYet />);
    expect(screen.getByText("Deine Ergebnisse")).toBeInTheDocument();
  });

  it("renders the card with encouraging text", () => {
    renderWithTheme(<NoResultsYet />);
    expect(screen.getByText(/Starte jetzt das Quiz/i)).toBeInTheDocument();
  });

  it("renders the mascot image", () => {
    const { container } = renderWithTheme(<NoResultsYet />);
    const mascotImage = container.querySelector('img[alt="Maskottchen"]');
    expect(mascotImage).toBeInTheDocument();
    expect(mascotImage).toHaveAttribute("src", "/mascot_standing_blue.svg");
  });

  it("renders the start button", () => {
    renderWithTheme(<NoResultsYet />);
    expect(screen.getByText("Quiz beginnen")).toBeInTheDocument();
  });

  it("navigates to /quiz when start button is clicked", () => {
    renderWithTheme(<NoResultsYet />);
    const startButton = screen.getByText("Quiz beginnen");
    fireEvent.click(startButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/quiz");
  });

  it("renders with proper styling", () => {
    const { container } = renderWithTheme(<NoResultsYet />);
    const cardStack = container.querySelector(".MuiBox-root");
    expect(cardStack).toBeInTheDocument();
  });
});
