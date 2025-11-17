import { getFilteredResultsLevel1 } from "../repositories/quiz.repository";

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

export async function filterLevel2(
  _studyProgrammeIds: number[] | undefined,
  _answers: any[],
) {
  // Implement level 2 filtering logic here
}

export async function filterLevel3(
  _studyProgrammeIds: number[] | undefined,
  _answers: any[],
) {
  // Implement level 3 filtering logic here
}
