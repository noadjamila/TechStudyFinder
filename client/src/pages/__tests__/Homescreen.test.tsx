import { render, screen, fireEvent } from "@testing-library/react";
import Homescreen from "../Home/Homescreen";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../../theme/theme";
import { ReactElement } from "react";

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

const renderWithProviders = (ui: ReactElement, { route = "/" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {ui}
      </ThemeProvider>
    </MemoryRouter>,
  );
};

describe("Homescreen Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });
  it("renders the title, subtitle, info text, and quiz button", () => {
    renderWithProviders(<Homescreen />);

    expect(screen.getByText(/Finde dein Studium/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Du weißt nicht, was du studieren möchtest\?/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Kein Problem!/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Tech Study Finder unterstützt dich dabei, Studiengänge zu finden/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Quiz beginnen/i)).toBeInTheDocument();
  });

  it("navigates to /quiz/level/1 when clicking the start button", () => {
    renderWithProviders(<Homescreen />);

    const button = screen.getByText(/Quiz beginnen/i);
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith("/quiz/level/1");
  });
});
