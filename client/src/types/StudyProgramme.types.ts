/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

export interface Deadline {
  typ: string;
  start?: string | null;
  ende?: string | null;
  kommentar?: string | null;
  semester?: string | null;
}

export interface StudyProgramme {
  studiengang_id: string;
  name: string;
  hochschule: string;
  abschluss: string;
  similarity?: number | null;
  homepage?: string | null;
  studienbeitrag?: string | null;
  beitrag_kommentar?: string | null;
  anmerkungen?: string | null;
  regelstudienzeit?: string | null;
  zulassungssemester?: string | null;
  zulassungsmodus?: string | null;
  zulassungsvoraussetzungen?: string | null;
  zulassungslink?: string | null;
  schwerpunkte?: string[] | null;
  sprachen?: string[] | null;
  standorte?: string[] | null;
  studienfelder?: string[] | null;
  studienform?: string[] | null;
  fristen?: Deadline[] | null;
}
