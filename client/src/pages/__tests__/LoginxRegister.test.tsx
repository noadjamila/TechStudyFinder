import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginxRegister from "../LoginxRegister";
import * as persistQuiz from "../../session/persistQuizResults";
import * as quizApi from "../../api/quizApi";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ state: {} }),
  };
});

vi.mock("../../components/login-register/Login", () => ({
  default: vi.fn(({ onSuccess }) => (
    <button onClick={onSuccess}>Mock Login</button>
  )),
}));

vi.mock("../../components/login-register/Register", () => ({
  default: vi.fn(({ onSuccess }) => (
    <button onClick={onSuccess}>Mock Register</button>
  )),
}));

vi.mock("../../components/dialogs/AuthSuccessDialog", () => ({
  default: vi.fn(({ open, onClose }) =>
    open ? <button onClick={onClose}>Close Dialog</button> : null,
  ),
}));

vi.mock("../../session/persistQuizResults");
vi.mock("../../api/quizApi");

describe("LoginxRegister", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    (persistQuiz.loadQuizResults as any).mockResolvedValue([
      { studiengang_id: "123", similarity: "0,98" },
      { studiengang_id: "456", similarity: "0,98" },
    ]);
    (quizApi.saveQuizResults as any).mockResolvedValue(undefined);
  });

  it("renders Login by default and triggers success dialog", () => {
    render(
      <MemoryRouter>
        <LoginxRegister />
      </MemoryRouter>,
    );

    // Login-Button aus Mock-Komponente
    fireEvent.click(screen.getByText("Mock Login"));

    // Dialog sollte jetzt sichtbar sein
    expect(screen.getByText("Close Dialog")).toBeInTheDocument();

    // Schließen des Dialogs sollte navigate triggern
    fireEvent.click(screen.getByText("Close Dialog"));
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("switches to Register when clicking link", () => {
    render(
      <MemoryRouter>
        <LoginxRegister />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Registrieren"));
    expect(screen.getByText("Mock Register")).toBeInTheDocument();
  });

  it("saves quiz results if present", async () => {
    render(
      <MemoryRouter>
        <LoginxRegister />
      </MemoryRouter>,
    );

    // Warten, bis Login-Mock gerendert ist
    await waitFor(() => {
      expect(screen.getByText("Mock Login")).toBeInTheDocument();
    });

    // Klick Login → handleSuccess wird ausgeführt
    fireEvent.click(screen.getByText("Mock Login"));

    // Warten, bis saveQuizResults aufgerufen wird
    await waitFor(() => {
      expect(quizApi.saveQuizResults).toHaveBeenCalledWith([
        { similarity: "0,98", studiengang_id: "123" },
        { similarity: "0,98", studiengang_id: "456" },
      ]);
    });

    // Dialog sollte sichtbar sein
    expect(screen.getByText("Close Dialog")).toBeInTheDocument();

    // Schließen des Dialogs → navigate
    fireEvent.click(screen.getByText("Close Dialog"));
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
