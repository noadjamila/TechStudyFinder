import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Homescreen from "../Homescreen";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../../theme/theme";
import { ReactElement } from "react";
import { AuthProvider } from "../../contexts/AuthContext";

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

vi.mock("../../api/authApi", () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  login: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("../../session/persistQuizResults", () => ({
  clearQuizResults: vi.fn().mockResolvedValue(undefined),
}));

const loadLatestSessionMock = vi.fn();
const clearQuizSessionMock = vi.fn();

vi.mock("../../session/persistQuizSession", () => ({
  loadLatestSession: (...args: unknown[]) => loadLatestSessionMock(...args),
  clearQuizSession: (...args: unknown[]) => clearQuizSessionMock(...args),
}));

const renderWithProviders = (ui: ReactElement, { route = "/" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>{ui}</AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
};

describe("Homescreen Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    vi.clearAllMocks();
    loadLatestSessionMock.mockResolvedValue(null);
    clearQuizSessionMock.mockResolvedValue(undefined);
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
    expect(
      screen.getByRole("button", { name: /Quiz beginnen/i }),
    ).toBeInTheDocument();
  });

  it("navigates to /quiz when clicking start and no session exists", async () => {
    loadLatestSessionMock.mockResolvedValueOnce(null);

    renderWithProviders(<Homescreen />);

    fireEvent.click(screen.getByText(/Quiz beginnen/i));

    await waitFor(() => {
      expect(loadLatestSessionMock).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith("/quiz");
    });
  });
  it("opens dialog when a saved session exists (does not navigate immediately)", async () => {
    loadLatestSessionMock.mockResolvedValueOnce({
      sessionId: "abc",
      currentLevel: 2,
      currentQuestionIndex: 3,
      answers: {},
      level2Questions: [],
      startedAt: Date.now(),
      updatedAt: Date.now(),
    });

    renderWithProviders(<Homescreen />);

    fireEvent.click(screen.getByText(/Quiz beginnen/i));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    expect(
      within(dialog).getByText(
        /Möchtest du dein gespeichertes Quiz fortsetzen oder ein neues Quiz starten\?/i,
      ),
    ).toBeInTheDocument();

    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("continues saved quiz when clicking 'FORTSETZEN'", async () => {
    loadLatestSessionMock.mockResolvedValueOnce({ sessionId: "abc" });

    renderWithProviders(<Homescreen />);

    fireEvent.click(screen.getByText(/Quiz beginnen/i));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const fortsetzenEls = within(dialog).getAllByText(/FORTSETZEN/i);
    fireEvent.click(fortsetzenEls[fortsetzenEls.length - 1]);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/quiz");
    });
  });

  it("clears session and starts new quiz when clicking 'NEU STARTEN'", async () => {
    loadLatestSessionMock.mockResolvedValueOnce({ sessionId: "abc" });
    clearQuizSessionMock.mockResolvedValueOnce(undefined);

    renderWithProviders(<Homescreen />);

    fireEvent.click(screen.getByText(/Quiz beginnen/i));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    fireEvent.click(within(dialog).getByText(/NEU STARTEN/i));

    await waitFor(() => {
      expect(clearQuizSessionMock).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith("/quiz");
    });
  });
});
