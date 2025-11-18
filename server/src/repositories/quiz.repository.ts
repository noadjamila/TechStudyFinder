import { pool } from "../../db";

/**
 * Retrieves filtered study programme IDs for level 1 based on the provided study type.
 *
 * @param studientyp the type of study programme (grundständig or weiterführend)
 * @returns filtered study programme IDs
 */
export async function getFilteredResultsLevel1(
  studientyp?: "grundständig" | "weiterführend", // optional
): Promise<number[]> {
  let query = `SELECT id FROM studiengang_raw_data_simulation`;
  let params: string[] = [];

  // if there is a studientyp filter, add it to the query
  if (studientyp) {
    query += ` WHERE studientyp = $1`;
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
 * @param highestRiasecTypes the three highest riasec types of the user
 * @param minMatches minimum number of matching riasec types to consider a study programme
 * @returns filtered study programme IDs
 */
export async function getFilteredResultsLevel2(
  studyProgrammeIds: number[] | undefined,
  highestRiasecTypes: string[],
  minMatches: number = 2,
): Promise<number[]> {
  if (!studyProgrammeIds || studyProgrammeIds.length === 0) {
    return [];
  }

  const query = `
    SELECT s.id
    FROM studiengang_raw_data_simulation AS s
    JOIN LATERAL unnest(s.riasec_type) AS t(type) ON TRUE
    WHERE s.id = ANY($1::int[])
      AND t.type = ANY($2::text[])
    GROUP BY s.id
    HAVING COUNT(*) >= $3
  `;

  const result = await pool.query(query, [
    studyProgrammeIds,
    highestRiasecTypes,
    minMatches,
  ]);

  return result.rows.map((row: any) => row.id);
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
  console.log("Questions Query successful:", result.rows);

  return result.rows;
}
