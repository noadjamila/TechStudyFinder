/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { pool } from "../../db";
import { RiasecScores } from "../types/riasecScores";
import { StudyProgramme } from "../types/studyProgramme";

/**
 * Saves or updates user quiz results in the database.
 * Uses UPSERT to handle both new and existing results.
 *
 * @param userId the user's ID
 * @param resultIds array of study programme IDs in order
 */
export async function saveUserQuizResults(
  userId: number,
  resultIds: string[],
): Promise<void> {
  const query = `
    INSERT INTO user_quiz_results (user_id, result_ids, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET result_ids = $2, updated_at = NOW()
  `;

  await pool.query(query, [userId, JSON.stringify(resultIds)]);
}

/**
 * Retrieves user quiz results from the database.
 *
 * @param userId the user's ID
 * @returns array of study programme IDs or null if no results found
 */
export async function getUserQuizResults(
  userId: number,
): Promise<string[] | null> {
  const query = `
    SELECT result_ids FROM user_quiz_results
    WHERE user_id = $1
  `;

  const result = await pool.query(query, [userId]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].result_ids;
}

/**
 * Retrieves filtered study programme IDs for level 1 based on the provided study type.
 *
 * @param studientyp the type of study programme (undergraduate, graduate or all)
 * @returns filtered study programme IDs
 */
export async function getFilteredResultsLevel1(
  studientyp: "undergraduate" | "graduate" | "all",
): Promise<number[]> {
  let query = `SELECT id FROM studiengaenge`;
  let params: string[] = [];

  if (studientyp == "all") {
    console.debug(
      "[DB DEBUG] Filtering skipped (studientyp is all). Returning ALL IDs.",
    );
  }

  if (studientyp != "all") {
    query += ` WHERE typ = $1`;
    params.push(studientyp);
  }

  // send query to database, return study programme ids
  const result = await pool.query(query, params);

  return result.rows.map((row: any) => row.id);
}

/**
 * Retrieves filtered study programme IDs for level 2 based on the provided riasec types.
 *
 * @param studyProgrammeIds list of study programme IDs to filter from
 * @param userScores the riasec scores of the user
 * @param minSimilarity minimum similarity threshold to consider a study programme
 * @returns 20 best matching study programme IDs
 */
export async function getFilteredResultsLevel2(
  studyProgrammeIds: number[] | undefined,
  userScores: RiasecScores,
  minSimilarity: number = 0.6,
): Promise<number[]> {
  if (!studyProgrammeIds || studyProgrammeIds.length === 0) {
    console.debug("No studyProgrammeIds provided, returning empty array.");
    return [];
  }

  const LIMIT = 20;

  const query = `
    WITH user_vector AS (
      SELECT
        $2::float AS r,
        $3::float AS i,
        $4::float AS a,
        $5::float AS s,
        $6::float AS e,
        $7::float AS c
    ),
    scored_studiengaenge AS (
      SELECT
        s.studiengang_id,

        -- Cosine Similarity
        (
          (s.r_score * u.r +
          s.i_score * u.i +
          s.a_score * u.a +
          s.s_score * u.s +
          s.e_score * u.e +
          s.c_score * u.c)
          /
          (
            NULLIF(
              SQRT(
                s.r_score^2 +
                s.i_score^2 +
                s.a_score^2 +
                s.s_score^2 +
                s.e_score^2 +
                s.c_score^2
              ), 0
            )
            *
            NULLIF(
              SQRT(
                u.r^2 + u.i^2 + u.a^2 +
                u.s^2 + u.e^2 + u.c^2
              ), 0
            )
          )
        ) AS similarity

      FROM studiengang_riasec_mv s
      CROSS JOIN user_vector u
      WHERE s.studiengang_id = ANY($1::text[])
    )

    SELECT
      studiengang_id
    FROM scored_studiengaenge
    WHERE similarity >= $8
    ORDER BY similarity DESC
    LIMIT $9;
  `;

  const result = await pool.query(query, [
    studyProgrammeIds, // $1
    userScores.R, // $2
    userScores.I, // $3
    userScores.A, // $4
    userScores.S, // $5
    userScores.E, // $6
    userScores.C, // $7
    minSimilarity, // $8
    LIMIT, // $9
  ]);

  return result.rows;
}

/**
 * Retrieves all level 2 questions.
 *
 * @returns list of level 2 questions
 */
export async function getQuestionsLevel2(): Promise<any[]> {
  const result = await pool.query(
    "SELECT * FROM fragen_level_zwei ORDER BY RANDOM()",
  );

  return result.rows;
}

export async function getStudyProgrammeById(
  id: string,
): Promise<StudyProgramme | undefined> {
  const result = await pool.query(
    "SELECT * FROM studiengang_full_view WHERE studiengang_id = $1",
    [id],
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  return result.rows[0];
}
