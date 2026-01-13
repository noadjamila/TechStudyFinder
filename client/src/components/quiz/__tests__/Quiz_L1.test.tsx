import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";
import { describe, expect, test, vi } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import Quiz_L1 from "../Quiz_L1";
import { postFilterLevel } from "../../../api/quizApi";
import { Answer } from "../../../types/QuizAnswer.types";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

vi.mock("../../../api/quizApi", () => ({
  postFilterLevel: vi.fn(),
}));

describe("Quiz_L1", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders question and options", () => {
    renderWithTheme(
      <Quiz_L1
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        level1ids={function (_ids: string[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );

    expect(screen.getByText("Möchtest du ...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ein Studium beginnen/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Einen Master studieren/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Dich erstmal umschauen/i }),
    ).toBeInTheDocument();
  });

  test("calls API, onAnswer, and onComplete after selecting an option", async () => {
    const mockOnAnswer = vi.fn();
    const mockOnComplete = vi.fn();
    vi.spyOn(Date, "now").mockReturnValue(1700000000000);
    (postFilterLevel as Mock).mockResolvedValue({ ids: [1, 2, 3] });

    renderWithTheme(
      <Quiz_L1
        onAnswer={mockOnAnswer}
        onComplete={mockOnComplete}
        level1ids={function (_ids: string[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );

    fireEvent.click(screen.getByText(/ein Studium beginnen\?/i));

    await waitFor(() => {
      expect(postFilterLevel).toHaveBeenCalled();
    });

    const expectedAnswer: Answer = {
      questionId: "level1.studyType",
      value: "undergraduate",
      answeredAt: 1700000000000,
    };

    expect(mockOnAnswer).toHaveBeenCalledWith(expectedAnswer);
    expect(mockOnComplete).toHaveBeenCalled();
  });

  test("shows alert on API error", async () => {
    (postFilterLevel as Mock).mockRejectedValue(new Error("fail"));

    renderWithTheme(
      <Quiz_L1
        onAnswer={vi.fn()}
        onComplete={vi.fn()}
        level1ids={function (_ids: string[]): void {
          throw new Error("Function not implemented.");
        }}
      />,
    );

    fireEvent.click(screen.getByText(/ein Studium beginnen\?/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
