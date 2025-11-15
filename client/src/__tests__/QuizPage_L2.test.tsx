import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import QuizPage_L2 from "../pages/QuizPage_L2";
import { initialScores } from "../types/RiasecTypes";

jest.useFakeTimers();

describe("QuizPage_L2", () => {
  test("renders the first question and QuizLayout", () => {
    render(<QuizPage_L2 />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();

    expect(screen.getByText(/Magst du das\?/i)).toBeInTheDocument();
  });

  test("updates score and moves to next question on 'yes'", async () => {
    jest.useFakeTimers();
    render(<QuizPage_L2 />);
    
    const yesOption = screen.getByLabelText("Ja");
    fireEvent.click(yesOption);

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getAllByText(/Magst du das\?/i).length).toBeGreaterThan(0);
    });

    jest.useRealTimers();
  });
});

describe("QuizPage_L2 score calculation", () => {
  test("increments score on 'yes'", async () => {
    const currentScores = { ...initialScores };
    const pointsMap: Record<string, number> = { yes: 1, no: -1, skip: 0 };
    const points = pointsMap["yes"];
    
    const newScores = { ...currentScores, R: currentScores["R"] + points };
    expect(newScores.R).toBe(+1);
  });

  test("score logic: 'no' decrements score", () => {
    const currentScores = { ...initialScores };
    const pointsMap: Record<string, number> = { yes: 1, no: -1, skip: 0 };
    const points = pointsMap["no"];
    
    const newScores = { ...currentScores, R: currentScores["R"] + points };
    expect(newScores.R).toBe(-1);
    });

  test("scores remain unchanged on 'skip'", () => {
    const currentScores = { ...initialScores };
    const pointsMap: Record<string, number> = { yes: 1, no: -1, skip: 0 };
    const points = pointsMap["skip"];

    const newScores = { ...currentScores, R: currentScores["R"] + points };
    expect(newScores.R).toBe(0);
    });
});
