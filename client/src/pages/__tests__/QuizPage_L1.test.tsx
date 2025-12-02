import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import QuizPage_L1 from "../QuizPage_L1";
import * as quizApi from "../../services/quizApi";

// Mock API
vi.mock("../../services/quizApi");

// Mocks the quizCard
vi.mock("../../components/quiz/QuizCard_L1", () => ({
  default: ({ question, options, onSelect }: any) =>
    React.createElement(
      "div",
      { "data-testid": "quiz-card-mock" },
      React.createElement("h2", null, question),
      options?.map((opt: any) =>
        React.createElement(
          "button",
          {
            key: opt.value,
            onClick: () => onSelect(opt.value),
            "data-testid": `option-${opt.value}`,
          },
          opt.label,
        ),
      ),
    ),
}));

const mockOnNextLevel = vi.fn();

describe("QuizPage_L1 – calls api and logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnNextLevel.mockClear();
  });

  it("renders the question and the answer possibilities", () => {
    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);
    expect(screen.getByText(/Möchtest du/i)).toBeInTheDocument();
    expect(screen.getByText(/ein Studium beginnen/i)).toBeInTheDocument();
    expect(screen.getByText(/dich erstmal umschauen/i)).toBeInTheDocument();
  });

  it("calls the API with 'grundständig'", async () => {
    const mockIds = [101, 102];
    vi.mocked(quizApi.postFilterLevel).mockResolvedValue({ ids: mockIds });

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);
    fireEvent.click(screen.getByText(/ein Studium beginnen/i));

    await waitFor(() => {
      expect(quizApi.postFilterLevel).toHaveBeenCalledWith({
        level: 1,
        answers: [{ studientyp: "grundständig" }],
      });
    });

    expect(mockOnNextLevel).toHaveBeenCalledWith(mockIds);
  });

  it("calls API with 'weiterführend' ", async () => {
    vi.mocked(quizApi.postFilterLevel).mockResolvedValue({ ids: [301] });

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);
    fireEvent.click(screen.getByText(/dein Studium fortsetzen/i));

    await waitFor(() => {
      expect(quizApi.postFilterLevel).toHaveBeenCalledWith({
        level: 1,
        answers: [{ studientyp: "weiterführend" }],
      });
    });
  });

  it("calls API without a filter, all study IDs are the result", async () => {
    vi.mocked(quizApi.postFilterLevel).mockResolvedValue({ ids: [201, 202] });

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);
    fireEvent.click(screen.getByText(/dich erstmal umschauen/i));

    await waitFor(() => {
      expect(quizApi.postFilterLevel).toHaveBeenCalledWith({
        level: 1,
        answers: [],
      });
    });
  });

  it("shows an alert because of an API mistakte", async () => {
    vi.mocked(quizApi.postFilterLevel).mockRejectedValue(
      new Error("Network error"),
    );

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);
    fireEvent.click(screen.getByText(/ein Studium beginnen/i));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error") || expect.stringContaining("error"),
      );
    });

    expect(mockOnNextLevel).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
