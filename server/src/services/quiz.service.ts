import {
  getFilteredResultsLevel1,
  getQuestionsLevel2,
  getFilteredResultsLevel2,
  saveUserQuizResults,
  getUserQuizResults,
} from "../repositories/quiz.repository";
import { RiasecScores } from "../types/riasecScores";
import { getStudyProgrammeById } from "../repositories/quiz.repository";
import { StudyProgramme } from "../types/studyProgramme";

/**
 * Saves user quiz results to the database.
 *
 * @param userId the user's ID
 * @param results array of result objects with studiengang_id and optional similarity
 */
export async function saveQuizResultsService(
  userId: number,
  results: Array<string | { studiengang_id: string; similarity?: number }>,
): Promise<void> {
  await saveUserQuizResults(userId, results);
}

/**
 * Retrieves user quiz results from the database.
 *
 * @param userId the user's ID
 * @returns array of result objects with studiengang_id and optional similarity, or null if no results found
 */
export async function getQuizResultsService(
  userId: number,
): Promise<Array<{ studiengang_id: string; similarity?: number }> | null> {
  return await getUserQuizResults(userId);
}

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

/**
 * Retrieves all level 2 questions.
 *
 * @returns list of level 2 questions
 */
export async function getQuestionsLevel2Service(): Promise<any[]> {
  return await getQuestionsLevel2();
}

export async function getStudyProgrammeByIdService(
  id: string,
): Promise<StudyProgramme | undefined> {
  return await getStudyProgrammeById(id);
}
