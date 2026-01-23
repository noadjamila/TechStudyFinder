import { pool } from "../../db";
import { RiasecData, RiasecUpdate } from "../types/riasecScores";
import bcrypt from "bcrypt";

type AuthAdmin = {
  id: number;
  adminname: string;
  password_hash: string;
};

/**
 * Fetches all RIASEC data from the database.
 * Includes:
 * - `studiengebiete`
 * - `studienfelder` (with overrides applied if present)
 * - `studiengaenge`
 *
 * @returns {Promise<RiasecData>} Object containing arrays of all three tables.
 * @throws Will throw an error if any database query fails.
 */
export async function getRiasecData(): Promise<RiasecData> {
  const studienfelder = await pool.query(
    `SELECT
      sf.id,
      sf.name,

      COALESCE(sf.riasec_override_r, sg.riasec_r) AS r,
      COALESCE(sf.riasec_override_i, sg.riasec_i) AS i,
      COALESCE(sf.riasec_override_a, sg.riasec_a) AS a,
      COALESCE(sf.riasec_override_s, sg.riasec_s) AS s,
      COALESCE(sf.riasec_override_e, sg.riasec_e) AS e,
      COALESCE(sf.riasec_override_c, sg.riasec_c) AS c

      FROM studienfelder sf
      JOIN studiengebiete sg
        ON sf.studiengebiet_id = sg.id
      ORDER BY sf.name;`,
  );

  const studiengebiete = await pool.query(
    `SELECT
      id,
      name,
      riasec_r as R,
      riasec_i as I,
      riasec_a as A,
      riasec_s as S,
      riasec_e as E,
      riasec_c as C
      FROM studiengebiete`,
  );

  const studiengaenge = await pool.query(
    `SELECT
      studiengang_id as id,
      studiengang_name as name,
      r_score as R,
      i_score as I,
      a_score as A,
      s_score as S,
      e_score as E,
      c_score as C
      FROM studiengang_riasec_mv`,
  );

  return {
    studiengebiete: studiengebiete.rows,
    studienfelder: studienfelder.rows,
    studiengaenge: studiengaenge.rows,
  };
}

/**
 * Updates RIASEC scores for a single item in one of the tables.
 * Handles `studienfelder` with overrides and `studiengebiete` normally.
 * Ignores keys that are unknown or null.
 *
 * @param {RiasecUpdate} riasecUpdates - Object containing:
 *   - `table`: Table to update (`studienfelder` or `studiengebiete`)
 *   - `id`: ID of the item to update
 *   - `changes`: Partial object with RIASEC keys (R, I, A, S, E, C) to update
 * @returns {Promise<void>} Resolves when update completes.
 * @throws Will throw an error if the database update fails.
 */
export async function updateRiasecData(
  riasecUpdates: RiasecUpdate,
): Promise<void> {
  const mapping =
    riasecUpdates.table === "studienfelder"
      ? {
          R: "riasec_override_r",
          I: "riasec_override_i",
          A: "riasec_override_a",
          S: "riasec_override_s",
          E: "riasec_override_e",
          C: "riasec_override_c",
        }
      : {
          R: "riasec_r",
          I: "riasec_i",
          A: "riasec_a",
          S: "riasec_s",
          E: "riasec_e",
          C: "riasec_c",
        };

  const setClauses: string[] = [];
  const values: any[] = [];

  let index = 1;

  for (const [key, value] of Object.entries(riasecUpdates.changes)) {
    if (value != null) {
      const upperKey = key.toUpperCase() as keyof typeof mapping;
      const column = mapping[upperKey];
      if (!column) {
        console.warn(`Unbekannter RIASEC-Key: ${key}`);
        continue;
      }
      setClauses.push(`${column} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (setClauses.length === 0) {
    console.log("Keine RIASEC-Werte zum Aktualisieren");
    return;
  }

  values.push(riasecUpdates.id);

  const query = `
    UPDATE ${riasecUpdates.table}
    SET ${setClauses.join(", ")}
    WHERE id = $${index}
  `;

  await pool.query(query, values);
}

/**
 * Finds a admin by adminname and password for login.
 * Uses constant time password comparison to prevent timing attacks.
 * @param username
 * @param password
 * @returns The admin object with id and adminname if credentials are valid, otherwise null.
 */
export async function findAdminForLogin(
  adminname: string,
  password: string,
): Promise<{ id: number; adminname: string } | null> {
  const dbAdmin = await pool.query<AuthAdmin>(
    "SELECT id, adminname, password_hash FROM admins WHERE adminname = $1",
    [adminname],
  );
  const admin = dbAdmin.rows[0];

  const passwordHash = admin.password_hash;

  const isValid = await bcrypt.compare(password, passwordHash);

  if (!admin || !isValid) return null;

  return { id: admin.id, adminname: admin.adminname };
}
