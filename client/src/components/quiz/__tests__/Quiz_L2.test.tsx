import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import { describe, test, beforeEach, expect, vi } from "vitest";
import Quiz_L2 from "../Quiz_L2";

vi.useRealTimers();

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );

describe("Quiz_L2", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    (globalThis as any).fetch = fetchMock;
  });

  const mockQuestions = [
    { text: "Frage 1", riasec_type: "R" },
    { text: "Frage 2", riasec_type: "I" },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    }) as any;
  });

  it("shows Loading before questions are loaded", () => {
    // keep fetch pending to hold loading state
    fetchMock.mockReturnValue(new Promise(() => {}));

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    expect(screen.getByText("Lädt...")).toBeInTheDocument();
  });

  test("should load questions from backend", async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    expect(global.fetch).toHaveBeenCalledWith("/api/quiz/level/2");

    await waitFor(() => {
      expect(screen.getByText("Frage 1")).toBeInTheDocument();
    });
  });

  test("answers 'yes' move to next question", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Frage 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Ja"));

    await waitFor(() => {
      expect(screen.getByText("Frage 2")).toBeInTheDocument();
    });
  });

  test("answers 'no' move to next question", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    await screen.findByText("Frage 1");

    fireEvent.click(screen.getByText("Nein"));

    await waitFor(() => {
      expect(screen.getByText("Frage 2")).toBeInTheDocument();
    });
  });

  test("answers 'skip' move to next question", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    await screen.findByText("Frage 1");

    fireEvent.click(screen.getByText("Überspringen"));

    await waitFor(() => {
      expect(screen.getByText("Frage 2")).toBeInTheDocument();
    });
  });

  test("should show error screen when question loading fails", async () => {
    (globalThis as any).fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    expect(
      await screen.findByText(
        "Die Fragen konnten nicht geladen werden. Bitte versuche es später erneut.",
      ),
    ).toBeInTheDocument();
  });

  test("renders mascot image", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={() => {}}
      />,
    );

    await screen.findByText("Frage 1");

    const mascot = screen.getByAltText("Mascot");
    expect(mascot).toBeInTheDocument();
  });

  test("calls oneLevelBack when currentIndex = 0", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });
    (globalThis as any).fetch = fetchMock;

    const oneLevelBack = vi.fn();

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={oneLevelBack}
      />,
    );

    await screen.findByText("Frage 1");

    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));

    expect(oneLevelBack).toHaveBeenCalledTimes(1);
  });

  test("goes back to previous question when currentIndex > 0", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    const oneLevelBack = vi.fn();

    renderWithProviders(
      <Quiz_L2
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={oneLevelBack}
      />,
    );

    await screen.findByText("Frage 1");
    fireEvent.click(screen.getByText("Ja"));
    await screen.findByText("Frage 2");
    fireEvent.click(screen.getByText("Zurück"));
    expect(screen.getByText("Frage 1")).toBeInTheDocument();
  });

  test("calls onAnswer and onComplete on final question", async () => {
    const onAnswer = vi.fn();
    const onComplete = vi.fn();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: mockQuestions }),
    });

    renderWithProviders(
      <Quiz_L2
        onAnswer={onAnswer}
        onComplete={onComplete}
        oneLevelBack={vi.fn()}
      />,
    );

    await screen.findByText("Frage 1");
    fireEvent.click(screen.getByText("Ja"));
    await screen.findByText("Frage 2");
    fireEvent.click(screen.getByText("Ja"));

    expect(onAnswer).toHaveBeenCalledTimes(2);
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        questionId: "level2.question0.R",
        value: "yes",
      }),
    );
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });
});
