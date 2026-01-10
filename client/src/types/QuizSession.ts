import { AnswerMap } from "./QuizAnswer.types";
import { RiasecType } from "./RiasecTypes";

export type QuizSession = {
  sessionId: string;

  currentLevel: 1 | 2 | 3;
  currentQuestionIndex: number;

  answers: AnswerMap;

  level2Questions?: {
    id: string;
    text: string;
    riasec_type: RiasecType;
  }[];

  startedAt: number;
  updatedAt: number;

  // TODO for (PR 6)
  userId?: string;
};
