import { execSync } from "child_process";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

/* -------- Helpers -------- */

/**
 * Executes a shell command synchronously.
 *
 * @param command - The shell command to execute.
 * @param cwd - Optional. The working directory in which to run the command.
 * @param env - Optional. Additional environment variables to merge with process.env.
 *
 * @throws Will throw an error if the command fails.
 */
function runCommand(command: string, cwd?: string, env?: NodeJS.ProcessEnv) {
  try {
    execSync(command, {
      stdio: "inherit",
      cwd,
      env: { ...process.env, ...env },
    });
  } catch (err) {
    throw new Error(`Command failed: ${command} \n${err}`);
  }
}

/**
 * Executes a SQL statement against the configured PostgreSQL database.
 *
 * @param sql - The SQL statement to execute.
 *
 * @throws Will throw an error if the SQL execution fails.
 */
function runSql(sql: string) {
  const cmd = `psql -v ON_ERROR_STOP=1 -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -c "${sql}"`;

  runCommand(cmd, undefined, {
    PGPASSWORD: DB_PASSWORD,
  });
}

/**
 * Runs a callback function inside a database transaction.
 * Automatically begins a transaction before running the callback and commits
 * if successful. If an error occurs, the transaction is rolled back.
 *
 * @param fn - The function containing SQL commands or database operations to run.
 *
 * @throws Will exit the process with code 1 if the transaction fails.
 */
function runInTransaction(fn: () => void) {
  try {
    console.debug("\n BEGIN TRANSACTION");
    runSql("BEGIN;");

    fn();

    runSql("COMMIT;");
    console.debug("COMMIT TRANSACTION");
  } catch (err) {
    console.error("\n ERROR – ROLLBACK", err);
    try {
      runSql("ROLLBACK;");
    } catch (_rollbackErr) {
      void _rollbackErr;
    }
    process.exit(1);
  }
}

/**
 * Imports a CSV file in one of the RIASEC tables using a staging table.
 * @param tableName Name of the target table ('studiengebiete' or 'studienfelder')
 * @param csvPath Path to the CSV file
 */
function importRiasecCsv(
  tableName: "studiengebiete" | "studienfelder",
  csvPath: string,
) {
  const stagingTable = `${tableName}_import`;

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
  runSql(createSql);

  // Import CSV data into staging table
  runCommand(
    `psql -v ON_ERROR_STOP=1 ` +
      `-h ${DB_HOST} -p ${DB_PORT} ` +
      `-U ${DB_USER} -d ${DB_NAME} ` +
      `-c "\\copy ${stagingTable} FROM '${csvPath}' WITH (FORMAT csv, HEADER true, DELIMITER ';', NULL 'NULL')"`,
    undefined,
    { PGPASSWORD: DB_PASSWORD },
  );

  // Update target table from staging table
  let updateSql = "";
  if (tableName === "studiengebiete") {
    updateSql = `
      UPDATE studiengebiete d
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
  } else if (tableName === "studienfelder") {
    updateSql = `
      UPDATE studienfelder d
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
  }
  runSql(updateSql);

  // Drop staging table
  runSql(`DROP TABLE ${stagingTable};`);
}

/* -------- Configuration -------- */

const DB_USER = process.env.DB_USER;
const DB_NAME = process.env.DB_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const ROOT_DIR = path.join(__dirname, "../..");
const SCHEMA_DIR = path.join(ROOT_DIR, "db/schema");
const SCRIPT_DIR = path.join(ROOT_DIR, "db/scripts");
const CSV_DIR = path.join(ROOT_DIR, "db/data");
const CHECK_NULLS_FILE = path.join(ROOT_DIR, "db/schema/check_nulls.sql");

const SCHEMA_FILES = ["institutions.sql", "degreeprogrammes.sql"];

const IMPORT_SCRIPTS = ["import_institutions.ts", "import_degreeprogrammes.ts"];

const CSV_FILES = ["studiengebiete_riasec.csv", "studienfelder_riasec.csv"];

const MATERIALIZED_VIEW = "studiengang_riasec_mv";

/* -------- Main script -------- */

console.debug("Initializing database with fresh data");

runInTransaction(() => {
  // Create schemas
  console.debug("\n Creating schemas");
  SCHEMA_FILES.forEach((file) => {
    const filePath = path.join(SCHEMA_DIR, file);
    runCommand(
      `psql -v ON_ERROR_STOP=1 -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f "${filePath}"`,
      undefined,
      { PGPASSWORD: DB_PASSWORD },
    );
  });

  // Import XML data
  console.debug("\n Importing XML data");
  IMPORT_SCRIPTS.forEach((script) => {
    const scriptPath = path.join(SCRIPT_DIR, script);
    runCommand(`npx ts-node "${scriptPath}"`, ROOT_DIR);
  });

  // Import CSV data (RIASEC)
  console.debug("\n Importing CSV data");
  CSV_FILES.forEach((file) => {
    const csvPath = path.join(CSV_DIR, file);
    console.debug(`  - Importing ${file}`);
    importRiasecCsv(
      file === "studiengebiete_riasec.csv" ? "studiengebiete" : "studienfelder",
      csvPath,
    );
  });

  // NULL-Checks on studiengebiete
  console.debug('\n Checking "studiengebiete" for NULL values');
  runCommand(
    `psql -v ON_ERROR_STOP=1 -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${CHECK_NULLS_FILE}`,
    undefined,
    { PGPASSWORD: DB_PASSWORD },
  );

  // Refresh materialized view
  console.debug("\n Refreshing materialized view");
  runSql(`REFRESH MATERIALIZED VIEW ${MATERIALIZED_VIEW};`);
});

console.debug("\n DONE – Database fully initialized");
