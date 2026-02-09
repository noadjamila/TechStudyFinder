import { AnswerMap } from "./QuizAnswer.types";
import { RiasecType } from "./RiasecTypes";

/**
 * Represents a quiz session with its state and progress.
 */
export type QuizSession = {
  sessionId: string;

  currentLevel: 1 | 2 | 3;
  currentQuestionIndex: number;

  level1IDS?: string[];
  resultIds?: string[];
  idsFromLevel2?: Array<{ studiengang_id: string; similarity?: number }>;

  showSuccessScreen?: boolean;

  answers: AnswerMap;

  level2Questions?: {
    id: string;
    text: string;
    riasec_type: RiasecType;
  }[];

  startedAt: number;
  updatedAt: number;

  userId?: string;
};
