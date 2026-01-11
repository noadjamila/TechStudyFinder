import { AnswerMap } from "../types/QuizAnswer.types";
import { initialScores, RiasecType } from "../types/RiasecTypes";

/**
 * Calculates RIASEC scores based on the provided answers.
 * @param answers - A map of answers keyed by question ID.
 * @returns An object mapping each RIASEC type to its calculated score.
 */
export function calculateRiasecScores(
  answers: AnswerMap,
): Record<RiasecType, number> {
  const scores = { ...initialScores };

  Object.values(answers).forEach((answer) => {
    if (!answer.questionId.startsWith("level2")) return;

    const riasecType = extractRiasecType(answer.questionId);
    const delta = answerValueToPoints(answer.value);

    scores[riasecType] += delta;
  });

  return scores;
}

/**
 * Extracts the RIASEC type from a question ID.
 * @param questionId
 * @returns The RIASEC type extracted from last segment of the question ID.
 */
function extractRiasecType(questionId: string): RiasecType {
  const parts = questionId.split(".");
  const candidate = parts[parts.length - 1];

  if (candidate in initialScores) {
    return candidate as RiasecType;
  }

  throw new Error(
    `Invalid questionId format "${questionId}": "${candidate}" is not a valid RIASEC type.`,
  );
}

/**
 * Converts an answer value to corresponding points.
 * @param value - The answer value ("yes", "no", or "skip").
 * @returns The points associated with the answer value.
 */
function answerValueToPoints(value: string | number | boolean): number {
  switch (value) {
    case "yes":
      return 1;
    case "no":
      return -1;
    case "skip":
    default:
      return 0;
  }
}
