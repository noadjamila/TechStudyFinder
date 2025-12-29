import {
  getFilteredResultsLevel1,
  getQuestionsLevel2,
  getFilteredResultsLevel2,
  getStudyProgrammesById,
} from "../repositories/quiz.repository";

/**
 * Handles filtering for level 1 based on the provided answers.
 *
 * @param answers answers from the quiz
 * @returns filtered study programme IDs
 */
export async function filterLevel1(answers: any[]): Promise<number[]> {
  // Extract studientyp from the first answer (level 1 only has one question)
  const studientyp = answers[0]?.studientyp;
  return await getFilteredResultsLevel1(studientyp);
}

/**
 * Retrieves study IDs based on highest RIASEC scores.
 *
 * @param _answers array of answers from level 2 (three highest RIASEC types)
 * @param _studyProgrammeIds array of study programme IDs
 * @returns filtered study programme IDs
 */
export async function filterLevel2(
  _studyProgrammeIds: number[] | undefined,
  _answers: any[],
): Promise<any[]> {
  if (!_answers || _answers.length === 0) {
    return [];
  }
  const types = _answers.map((s) => s.type).filter(Boolean);
  if (types.length === 0) {
    return [];
  }
  const minMatches = 2;
  return await getFilteredResultsLevel2(_studyProgrammeIds, types, minMatches);
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

/**
 * Fetches study programme details by their IDs.
 *
 * @param studyProgrammeIds array of study programme IDs
 * @returns array of study programmes with name, university, and degree
 */
export async function getStudyProgrammeDetails(
  studyProgrammeIds: string[],
): Promise<any[]> {
  return await getStudyProgrammesById(studyProgrammeIds);
}
