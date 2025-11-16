export interface FilterRequest {
  level: 1 | 2 | 3;
  answers: any[];
  studyProgrammeIds?: number[];
}
