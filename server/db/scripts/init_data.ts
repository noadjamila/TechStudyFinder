import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { Client } from "pg";
import { importInstitutions } from "../modules/import_institutions";
import { importDegreeProgrammes } from "../modules/import_degreeprogrammes";
import { importRiasecCsv } from "../modules/csv_riasec_import";

dotenv.config();

const ROOT_DIR = path.join(__dirname, "../..");
const SCHEMA_DIR = path.join(ROOT_DIR, "db/schema");
const CSV_DIR = path.join(ROOT_DIR, "db/data");

const SCHEMA_FILES = [
  "users.sql",
  "session.sql",
  "institutions.sql",
  "degreeprogrammes.sql",
  "favourites.sql",
];

const CSV_FILES = ["studiengebiete_riasec.csv", "studienfelder_riasec.csv"];
const CSV_TABLE_MAP: Record<string, string> = {
  "studiengebiete_riasec.csv": "studiengebiete",
  "studienfelder_riasec.csv": "studienfelder",
};

const CHECK_NULLS_FILE = path.join(SCHEMA_DIR, "check_nulls.sql");

const MATERIALIZED_VIEW = "studiengang_riasec_mv";

async function main() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  await client.connect();

  try {
    console.debug("\nInitializing database with fresh data");

    await client.query("BEGIN");
    await client.query("SET search_path TO public;");

    // Create schemas
    console.debug("\n Creating schemas");
    for (const file of SCHEMA_FILES) {
      const filePath = path.join(SCHEMA_DIR, file);
      const sql = fs.readFileSync(filePath, "utf8");
      const statements = sql
        .split(/;\s*$/m)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const stmt of statements) {
        await client.query(stmt);
      }
    }

    // Import XML data
    console.debug("\n Importing XML data");
    await importInstitutions(client);
    await importDegreeProgrammes(client);

    // Import CSV data (RIASEC)
    console.debug("\n Importing CSV data");
    for (const file of CSV_FILES) {
      const tableName = CSV_TABLE_MAP[file];
      if (!tableName) throw new Error(`No table mapping for ${file}`);
      console.debug(`  - Importing ${file} → table ${tableName}`);
      await importRiasecCsv(tableName, path.join(CSV_DIR, file), client);
    }

    // NULL-Checks on studiengebiete
    console.debug('\n Checking "studiengebiete" for NULL values');
    const sql = fs.readFileSync(CHECK_NULLS_FILE, "utf8");
    await client.query(sql);

    // Refresh materialized view
    console.debug("\n Refreshing materialized view");
    await client.query(`REFRESH MATERIALIZED VIEW ${MATERIALIZED_VIEW};`);

    await client.query("COMMIT");
    console.debug("DONE – Database fully initialized");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\nERROR – ROLLBACK", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
});
