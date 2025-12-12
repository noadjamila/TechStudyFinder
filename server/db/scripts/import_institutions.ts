import fs from "fs";
import { parseStringPromise } from "xml2js";
import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Extraxt german text from possible multilingual fields
function getTextDe(nameField: any): string | null {
  if (!nameField) return null;

  const namesArray = Array.isArray(nameField) ? nameField : [nameField];

  for (const n of namesArray) {
    if (n?.lang === "de" && typeof n._ === "string") {
      return n._.trim();
    }
    if (n?.lang === "de" && typeof n === "string") {
      return n.trim();
    }
  }
  return null;
}

// Extract phone and fax number with prefix from field
function getPhone(field: any): string | null {
  if (!field) return null;
  const prefix = field.prefix || "";
  const number = field._?.trim() || "";
  const full = (prefix + number).trim();
  return full.length > 0 ? full : null;
}

// Helper for batch-inserts
async function batchInsert(
  client: Client,
  table: string,
  columns: string[],
  rows: any[][],
  conflict?: string,
) {
  if (!rows.length) return;

  const values: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  for (const row of rows) {
    const placeholders = row.map(() => `$${paramIndex++}`);
    values.push(`(${placeholders.join(",")})`);
    params.push(...row);
  }

  const query = `
    INSERT INTO ${table} (${columns.join(",")})
    VALUES ${values.join(",")}
    ${conflict ? `ON CONFLICT ${conflict} DO NOTHING` : ""}
  `;
  await client.query(query, params);
}

async function main() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  await client.connect();

  const xmlPath = path.join("db/scripts", "../xml/institutions.xml");

  if (!fs.existsSync(xmlPath)) {
    console.error("XML file not found:", xmlPath);
    process.exit(1);
  }

  const xmlData = fs.readFileSync(xmlPath, "utf-8");

  const result = await parseStringPromise(xmlData, {
    explicitArray: false,
    mergeAttrs: true,
  });

  const deliveries = Array.isArray(result.institutions.delivery)
    ? result.institutions.delivery
    : [result.institutions.delivery];

  let institutions: any[] = [];
  for (const delivery of deliveries) {
    if (!delivery.institution) continue;
    institutions.push(
      ...(Array.isArray(delivery.institution)
        ? delivery.institution
        : [delivery.institution]),
    );
  }
  if (institutions.length === 0) {
    console.error("No institutions found!");
    process.exit(1);
  }
  console.log(`✅ ${institutions.length} institutions found.`);

  const hochschultypRows: any[][] = [];
  const traegerschaftRows: any[][] = [];
  const hochschuleRows: any[][] = [];

  for (const inst of institutions) {
    const id = inst.id ? inst.id : null;
    if (!id) continue;

    const name = getTextDe(inst.name);
    const shortname = inst.shortname?._ || null;
    const state = getTextDe(inst.state?.name);
    const city = inst.city?.name?._ || null;
    const phone = getPhone(inst.phone);
    const fax = getPhone(inst.fax);
    const homepage = inst.homepage || null;
    const email = inst.e_mail || null;
    const logo = inst.logo || null;
    const foundation_year = inst.foundation_year
      ? parseInt(inst.foundation_year)
      : null;
    const award_phd = inst.award_phd?.possible === "true" ? true : false;
    const award_habil = inst.award_habil?.possible === "true" ? true : false;
    const clinic = inst.clinic?.possible === "true" ? true : false;
    const student_statistic = JSON.stringify(inst.student_statistic || {});

    // institution_type
    const institution_type_id = inst.institution_type?.id
      ? parseInt(inst.institution_type.id)
      : null;
    const institution_type_name = getTextDe(inst.institution_type?.name);
    if (institution_type_id && institution_type_name) {
      hochschultypRows.push([institution_type_id, institution_type_name]);
    }

    // institutional_control
    const institutional_control_id = inst.institutional_control?.id
      ? parseInt(inst.institutional_control.id)
      : null;
    const institutional_control_name = getTextDe(
      inst.institutional_control?.name,
    );
    if (institutional_control_id && institutional_control_name) {
      traegerschaftRows.push([
        institutional_control_id,
        institutional_control_name,
      ]);
    }

    hochschuleRows.push([
      id,
      name,
      shortname,
      state,
      city,
      phone,
      fax,
      homepage,
      email,
      logo,
      institution_type_id,
      institutional_control_id,
      foundation_year,
      award_phd,
      award_habil,
      clinic,
      student_statistic,
    ]);
  }

  try {
    await client.query("BEGIN");

    await batchInsert(
      client,
      "hochschultyp",
      ["id", "name"],
      hochschultypRows,
      "(id)",
    );
    await batchInsert(
      client,
      "traegerschaft",
      ["id", "name"],
      traegerschaftRows,
      "(id)",
    );
    await batchInsert(
      client,
      "hochschule",
      [
        "id",
        "name",
        "kurzname",
        "bundesland",
        "stadt",
        "telefon",
        "fax",
        "homepage",
        "email",
        "logo",
        "hochschultyp_id",
        "traegerschaft_id",
        "gruendungsjahr",
        "promotionsrecht",
        "habilitationsrecht",
        "uniklinik",
        "student_statistik",
      ],
      hochschuleRows,
      "(id)",
    );

    await client.query("COMMIT");
    console.log("Import succeeded!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Import failed, rollback executed.", err);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
});
