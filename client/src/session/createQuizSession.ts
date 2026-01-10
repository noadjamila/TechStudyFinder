import { QuizSession } from "../types/QuizSession";

export function createQuizSession(): QuizSession {
  return {
    sessionId: crypto.randomUUID(),
    currentLevel: 1,
    currentQuestionIndex: 0,
    answers: {},
    level2Questions: [],
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };
}
