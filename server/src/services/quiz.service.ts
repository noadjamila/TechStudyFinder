import {
  getFilteredResultsLevel1,
  getQuestionsLevel2,
  getFilteredResultsLevel2,
} from "../repositories/quiz.repository";
import { RiasecScores } from "../types/riasecScores";

/**
 * Handles filtering for level 1 based on the provided answers.
 *
 * @param answers answers from the quiz
 * @returns filtered study programme IDs
 */
export async function filterLevel1(answers: any[]): Promise<number[]> {
  // Extract studientyp from the first answer (level 1 only has one question)
  const studientyp = answers[0]?.studientyp ?? "all";
  return await getFilteredResultsLevel1(studientyp);
}

/**
 * Retrieves study IDs based on highest RIASEC scores.
 *
 * @param _answers array of RIASEC-Score-Map from level 2
 * @param _studyProgrammeIds array of study programme IDs
 * @returns filtered study programme IDs
 */
export async function filterLevel2(
  _studyProgrammeIds: number[] | undefined,
  _answers: any[],
): Promise<any[]> {
  if (_answers.length < 6) {
    return [];
  }

  let userScores = _answers.reduce(
    (acc: RiasecScores, curr: { type: string; score: number }) => {
      acc[curr.type as keyof RiasecScores] = curr.score;
      return acc;
    },
    {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    },
  );

  return await getFilteredResultsLevel2(_studyProgrammeIds, userScores);
}

export async function filterLevel3(
  _studyProgrammeIds: number[] | undefined,
  _answers: any[],
) {
  // Implement level 3 filtering logic here
}

/**
 * Retrieves all level 2 questions.
 *
 * @returns list of level 2 questions
 */
export async function getQuestionsLevel2Service(): Promise<any[]> {
  return await getQuestionsLevel2();
}
