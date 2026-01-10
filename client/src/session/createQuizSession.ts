import { QuizSession } from "./QuizSession";

export function createQuizSession(): QuizSession {
  return {
    sessionId: crypto.randomUUID(),
    currentLevel: 1,
    currentQuestionIndex: 0,
    answers: {},
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };
}
