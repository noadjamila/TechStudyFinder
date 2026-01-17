import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import { describe, test, expect, vi } from "vitest";
import Quiz_L2 from "../Quiz_L2";
import type { QuizSession } from "../../../types/QuizSession";

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );

describe("Quiz_L2", () => {
  const mockQuestions = [
    { text: "Frage 1", riasec_type: "R", id: "q1" },
    { text: "Frage 2", riasec_type: "I", id: "q2" },
  ];

  const baseSession: QuizSession = {
    sessionId: "session-1",
    currentLevel: 2,
    currentQuestionIndex: 0,
    answers: {},
    level2Questions: mockQuestions,
    startedAt: 1,
    updatedAt: 1,
  };

  test("shows loading when no questions are available", () => {
    renderWithProviders(
      <Quiz_L2
        session={{ ...baseSession, level2Questions: [] }}
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
        onQuestionBack={vi.fn()}
        onQuestionNext={vi.fn()}
      />,
    );

    expect(screen.getByText("Lädt...")).toBeInTheDocument();
  });

  test("renders the current question text", async () => {
    renderWithProviders(
      <Quiz_L2
        session={baseSession}
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
        onQuestionBack={vi.fn()}
        onQuestionNext={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Frage 1")).toBeInTheDocument();
    });
  });

  test("answers 'yes' call onAnswer and onQuestionNext", async () => {
    const onAnswer = vi.fn();
    const onQuestionNext = vi.fn();

    renderWithProviders(
      <Quiz_L2
        session={baseSession}
        onAnswer={onAnswer}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
        onQuestionBack={vi.fn()}
        onQuestionNext={onQuestionNext}
      />,
    );

    fireEvent.click(screen.getByText("Ja"));

    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        questionId: "level2.question0.R",
        value: "yes",
      }),
    );
    await waitFor(() => {
      expect(onQuestionNext).toHaveBeenCalledTimes(1);
    });
  });

  test("answers 'no' call onAnswer and onQuestionNext", async () => {
    const onAnswer = vi.fn();
    const onQuestionNext = vi.fn();

    renderWithProviders(
      <Quiz_L2
        session={baseSession}
        onAnswer={onAnswer}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
        onQuestionBack={vi.fn()}
        onQuestionNext={onQuestionNext}
      />,
    );

    fireEvent.click(screen.getByText("Nein"));

    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        questionId: "level2.question0.R",
        value: "no",
      }),
    );
    await waitFor(() => {
      expect(onQuestionNext).toHaveBeenCalledTimes(1);
    });
  });

  test("answers 'skip' call onAnswer and onQuestionNext", async () => {
    const onAnswer = vi.fn();
    const onQuestionNext = vi.fn();

    renderWithProviders(
      <Quiz_L2
        session={baseSession}
        onAnswer={onAnswer}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
        onQuestionBack={vi.fn()}
        onQuestionNext={onQuestionNext}
      />,
    );

    fireEvent.click(screen.getByText("Überspringen"));

    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        questionId: "level2.question0.R",
        value: "skip",
      }),
    );
    await waitFor(() => {
      expect(onQuestionNext).toHaveBeenCalledTimes(1);
    });
  });

  test("renders mascot image", () => {
    renderWithProviders(
      <Quiz_L2
        session={baseSession}
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={() => {}}
        onQuestionBack={vi.fn()}
        onQuestionNext={vi.fn()}
      />,
    );

    const mascot = screen.getByAltText("Mascot");
    expect(mascot).toBeInTheDocument();
  });

  test("calls oneLevelBack when currentIndex = 0", () => {
    const oneLevelBack = vi.fn();

    renderWithProviders(
      <Quiz_L2
        session={baseSession}
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={oneLevelBack}
        onQuestionBack={vi.fn()}
        onQuestionNext={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));

    expect(oneLevelBack).toHaveBeenCalledTimes(1);
  });

  test("calls onQuestionBack when currentIndex > 0", () => {
    const onQuestionBack = vi.fn();

    renderWithProviders(
      <Quiz_L2
        session={{ ...baseSession, currentQuestionIndex: 1 }}
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        oneLevelBack={vi.fn()}
        onQuestionBack={onQuestionBack}
        onQuestionNext={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Zurück"));

    expect(onQuestionBack).toHaveBeenCalledTimes(1);
  });

  test("calls onComplete on final question", async () => {
    const onComplete = vi.fn();

    renderWithProviders(
      <Quiz_L2
        session={{ ...baseSession, currentQuestionIndex: 1 }}
        onAnswer={vi.fn()}
        onComplete={onComplete}
        oneLevelBack={vi.fn()}
        onQuestionBack={vi.fn()}
        onQuestionNext={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText("Ja"));

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });
});
