import { initialScores } from "../../types/RiasecTypes";

jest.useFakeTimers();

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
