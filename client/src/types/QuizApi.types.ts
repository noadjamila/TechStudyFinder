/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { RiasecType } from "./RiasecTypes";

export interface Level1Answer {
  studientyp: string;
}

export interface Level2Answer {
  type: string; // RiasecType
  score: number;
}

export type QuizAnswer = Level1Answer | Level2Answer;

/**
 * Interface for quiz questions returned from the backend.
 */
export interface QuizQuestion {
  text: string;
  riasec_type: RiasecType;
}

/**
 * Interface for the response when fetching quiz level questions.
 */
export interface QuizLevelResponse {
  questions: QuizQuestion[];
}

export interface QuizFilterPayload {
  level: 1 | 2 | 3;
  answers: QuizAnswer[];
  studyProgrammeIds?: string[];
}

/**
 * Interface defining the expected response structure from the filtering endpoint.
 */
export interface FilterResponse {
  ids: string[];
}
