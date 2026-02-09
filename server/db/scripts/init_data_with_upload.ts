/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

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
  "institutions.sql",
  "degreeprogrammes.sql",
  "degreeprogramme_view.sql",
];

const CSV_FILES = ["studiengebiete_riasec.csv", "studienfelder_riasec.csv"];
const CSV_TABLE_MAP: Record<string, string> = {
  "studiengebiete_riasec.csv": "studiengebiete",
  "studienfelder_riasec.csv": "studienfelder",
};

const CHECK_NULLS_FILE = path.join(SCHEMA_DIR, "check_nulls.sql");
const MATERIALIZED_VIEW = "studiengang_riasec_mv";

export async function initializeDatabaseWithUpload(
  institutionsXml?: string,
  degreeprogrammesXml?: string,
) {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  await client.connect();

  try {
    await client.query("BEGIN");
    await client.query("SET search_path TO public;");

    // Create schemas
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

    // Import XML data (entweder hochgeladen oder vom Standard-Pfad)
    if (institutionsXml) {
      await importInstitutions(client, institutionsXml);
    } else {
      await importInstitutions(client);
    }

    if (degreeprogrammesXml) {
      await importDegreeProgrammes(client, degreeprogrammesXml);
    } else {
      await importDegreeProgrammes(client);
    }

    // Import CSV data (RIASEC)
    for (const file of CSV_FILES) {
      const tableName = CSV_TABLE_MAP[file];
      if (!tableName) throw new Error(`No table mapping for ${file}`);
      await importRiasecCsv(tableName, path.join(CSV_DIR, file), client);
    }

    // NULL-Checks on studiengebiete
    const sql = fs.readFileSync(CHECK_NULLS_FILE, "utf8");
    await client.query(sql);

    // Refresh materialized view
    await client.query(`REFRESH MATERIALIZED VIEW ${MATERIALIZED_VIEW};`);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }
}
