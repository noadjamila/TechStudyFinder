/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

export type RiasecScores = {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
};

interface RiasecTableItem {
  id: number;
  name: string;
  R: number | null;
  I: number | null;
  A: number | null;
  S: number | null;
  E: number | null;
  C: number | null;
}

export interface RiasecData {
  studienfelder: RiasecTableItem[];
  studiengebiete: RiasecTableItem[];
  studiengaenge: RiasecTableItem[];
}

export interface RiasecUpdate {
  table: "studienfelder" | "studiengebiete";
  id: number;
  changes: { [key: string]: number | null };
}
