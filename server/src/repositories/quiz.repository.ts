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
