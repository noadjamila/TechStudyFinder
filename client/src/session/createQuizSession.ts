import { QuizSession } from "../types/QuizSession";

/**
 * Creates and returns a new QuizSession object with default values.
 * @returns A new QuizSession instance.
 */
export function createQuizSession(): QuizSession {
  return {
    sessionId: crypto.randomUUID(),
    level1IDS: [],
    resultIds: [],
    currentLevel: 1,
    currentQuestionIndex: 0,
    answers: {},
    level2Questions: [],
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };
}
