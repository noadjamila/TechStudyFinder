import { Client } from "pg";
import fs from "fs";
import { from as copyFrom } from "pg-copy-streams";

/**
 * Copies data from a CSV file into a PostgreSQL table using the COPY command.
 *
 * @param tableName - The name of the target table.
 * @param csvPath - The path to the CSV file.
 * @param client - The PostgreSQL client instance.
 *
 * @returns A promise that resolves when the copy operation is complete.
 */
async function copyCsvIntoTable(
  tableName: string,
  csvPath: string,
  client: Client,
) {
  return new Promise<void>((resolve, reject) => {
    const stream = client.query(
      copyFrom(
        `COPY ${tableName} FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER ';', NULL 'NULL')`,
      ),
    );

    fs.createReadStream(csvPath)
      .pipe(stream)
      .on("finish", resolve)
      .on("error", reject);
  });
}

/**
 * Imports a CSV file in one of the RIASEC tables using a staging table.
 * @param tableName Name of the target table ('studiengebiete' or 'studienfelder')
 * @param csvPath Path to the CSV file
 * @param client PostgreSQL client instance
 * @throws Error if the tableName is unexpected or if any database operation fails
 */
export async function importRiasecCsv(
  tableName: string,
  csvPath: string,
  client: Client,
) {
  const schema = "public";
  const stagingTable = `"${schema}"."${tableName}_import"`;
  const targetTable = `"${schema}"."${tableName}"`;

  // Create staging table
  let createSql = `
      DROP TABLE IF EXISTS ${stagingTable};
      CREATE UNLOGGED TABLE ${stagingTable} (
        id INTEGER PRIMARY KEY,
        riasec_r INTEGER,
        riasec_i INTEGER,
        riasec_a INTEGER,
        riasec_s INTEGER,
        riasec_e INTEGER,
        riasec_c INTEGER
      );
    `;
  await client.query(createSql.trim());

  await copyCsvIntoTable(stagingTable, csvPath, client);

  // Update target table from staging table
  let updateSql: string;
  switch (tableName) {
    case "studiengebiete":
      updateSql = `
        UPDATE ${targetTable} d
        SET
          riasec_r = r.riasec_r,
          riasec_i = r.riasec_i,
          riasec_a = r.riasec_a,
          riasec_s = r.riasec_s,
          riasec_e = r.riasec_e,
          riasec_c = r.riasec_c
        FROM ${stagingTable} r
        WHERE d.id = r.id;
      `;
      break;
    case "studienfelder":
      updateSql = `
        UPDATE ${targetTable} d
        SET
          riasec_override_r = r.riasec_r,
          riasec_override_i = r.riasec_i,
          riasec_override_a = r.riasec_a,
          riasec_override_s = r.riasec_s,
          riasec_override_e = r.riasec_e,
          riasec_override_c = r.riasec_c
        FROM ${stagingTable} r
        WHERE d.id = r.id;
      `;
      break;
    default:
      throw new Error(`Unexpected tableName: ${tableName}`);
  }
  await client.query(updateSql);

  await client.query(`DROP TABLE ${stagingTable};`);
}
