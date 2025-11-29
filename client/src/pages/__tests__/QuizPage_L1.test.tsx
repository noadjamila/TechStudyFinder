import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// mocks the layout and cardBase
vi.mock("../../layouts/QuizLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="quiz-layout">{children}</div>
  ),
}));
vi.mock("../../components/quiz/QuizCardBase", () => ({
  default: ({ question, options, onSelect }: any) => (
    <div data-testid="quiz-card-base">
      <h2>{question}</h2>
      {options.map((option: any) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          data-testid={`option-${option.value}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

import QuizPage_L1 from "../QuizPage_L1";
import * as quizApi from "../../services/quizApi";

// creates the mocks
const postFilterLevelMock = vi.spyOn(quizApi, "postFilterLevel");

//sets the mocks back after each test
describe("QuizPage_L1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. tests if card is rendered correctly
  it("renders the question and options correctly", () => {
    render(<QuizPage_L1 />);
    expect(screen.getByText("Möchtest du...")).toBeInTheDocument();
    expect(screen.getByTestId("option-grundständig")).toHaveTextContent(
      "ein Studium beginnen?",
    );
    expect(screen.getByTestId("option-all")).toHaveTextContent(
      "dich erstmal umschauen?",
    );
  });

  // 2. tests the undergraduates (grundständig)
  it("calls API with correct payload and triggers onNextLevel after 800ms when 'grundständig' is selected", async () => {
    const mockOnNextLevel = vi.fn();
    const mockResponseIds = [101, 102];
    postFilterLevelMock.mockResolvedValue({ ids: mockResponseIds });

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);

    fireEvent.click(screen.getByTestId("option-grundständig"));

    expect(postFilterLevelMock).not.toHaveBeenCalled();
    expect(mockOnNextLevel).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(postFilterLevelMock).toHaveBeenCalledWith({
        level: 1,
        answers: [{ studientyp: "grundständig" }], // expected payload
      });
    });

    expect(mockOnNextLevel).toHaveBeenCalledWith(mockResponseIds);
  });

  // 3. tests graduate (weiterführend)
  it("calls API with correct payload and triggers onNextLevel after 800ms when 'weiterführend' is selected", async () => {
    const mockOnNextLevel = vi.fn();
    const mockResponseIds = [301];
    postFilterLevelMock.mockResolvedValue({ ids: mockResponseIds });

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);

    fireEvent.click(screen.getByTestId("option-weiterführend"));

    await waitFor(() => {
      expect(postFilterLevelMock).toHaveBeenCalledWith({
        level: 1,
        answers: [{ studientyp: "weiterführend" }], //expected payload
      });
    });

    expect(mockOnNextLevel).toHaveBeenCalledWith(mockResponseIds);
  });

  // 4. tests selection of all (erstmal umschauen)
  it("calls API with empty answers array and triggers onNextLevel after 800ms when 'all' is selected", async () => {
    const mockOnNextLevel = vi.fn();
    const mockResponseIds = [201, 202, 203];
    postFilterLevelMock.mockResolvedValue({ ids: mockResponseIds });

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);

    fireEvent.click(screen.getByTestId("option-all"));

    await waitFor(() => {
      expect(postFilterLevelMock).toHaveBeenCalledWith({
        level: 1,
        answers: [], // Erwartete Payload
      });
    });

    expect(mockOnNextLevel).toHaveBeenCalledWith(mockResponseIds);
  });

  // 5. tests the failing message
  it("shows an alert and does NOT call onNextLevel if API request fails", async () => {
    const mockOnNextLevel = vi.fn();
    postFilterLevelMock.mockRejectedValue(new Error("API Error"));

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<QuizPage_L1 onNextLevel={mockOnNextLevel} />);

    fireEvent.click(screen.getByTestId("option-weiterführend"));

    await waitFor(() => {
      expect(postFilterLevelMock).toHaveBeenCalled();

      expect(alertSpy).toHaveBeenCalledWith(
        "Beim Laden ist ein Fehler aufgetreten. Bitte erneut versuchen.",
      );

      expect(mockOnNextLevel).not.toHaveBeenCalled();
    });

    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
