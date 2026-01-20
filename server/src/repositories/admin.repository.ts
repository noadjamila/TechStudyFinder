import { pool } from "../../db";

interface RiasecData {
  studienfelder: any[];
  studiengebiete: any[];
  studiengaenge: any[];
}

export async function getRiasecData(): Promise<RiasecData> {
  const studienfelder = await pool.query(
    `SELECT
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
