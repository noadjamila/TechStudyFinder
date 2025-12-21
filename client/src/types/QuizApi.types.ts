export interface Level1Answer {
  studientyp: string;
}

export interface Level2Answer {
  type: string; // RiasecType
  score: number;
}

export type QuizAnswer = Level1Answer | Level2Answer;

export interface QuizFilterPayload {
  level: 1 | 2 | 3;
  answers: QuizAnswer[];
  studyProgrammeIds?: number[];
}

/**
 * Interface defining the expected response structure from the filtering endpoint.
 */
export interface FilterResponse {
  ids: number[];
}
