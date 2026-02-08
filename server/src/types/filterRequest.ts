/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

export interface FilterRequest {
  level: 1 | 2 | 3;
  answers: any[];
  studyProgrammeIds?: number[];
}
