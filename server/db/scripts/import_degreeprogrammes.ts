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

// Helper for batch-inserts
const BATCH_SIZE = 500;

async function batchInsert(
  client: Client,
  table: string,
  columns: string[],
  rows: any[][],
  conflict?: string,
) {
  if (!rows.length) return;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    const values: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    for (const row of batch) {
      if (row.length !== columns.length) {
        throw new Error(
          `Row length ${row.length} does not match columns length ${columns.length}`,
        );
      }
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

  const xmlPath = path.join(__dirname, "../xml/degreeprogrammes.xml");

  if (!fs.existsSync(xmlPath)) {
    console.error("XML file not found:", xmlPath);
    process.exit(1);
  }

  const xmlData = fs.readFileSync(xmlPath, "utf-8");

  const result = await parseStringPromise(xmlData, {
    explicitArray: false,
    mergeAttrs: true,
  });

  const deliveries = Array.isArray(result.degreeProgrammes.delivery)
    ? result.degreeProgrammes.delivery
    : [result.degreeProgrammes.delivery];

  let degreeprogrammes: any[] = [];

  for (const delivery of deliveries) {
    if (!delivery.degreeProgramme) continue;
    degreeprogrammes.push(
      ...(Array.isArray(delivery.degreeProgramme)
        ? delivery.degreeProgramme
        : [delivery.degreeProgramme]),
    );
  }
  if (degreeprogrammes.length === 0) {
    console.error("No programmeDegrees found!");
    process.exit(1);
  }
  console.log(`✅ ${degreeprogrammes.length} programmes found.`);

  // Prepare arrays for batch inserts
  const degrees: any[] = [];
  const programmes: any[] = [];
  const deadlines: any[] = [];
  const disciplines: any[] = [];
  const programme_disciplines: any[] = [];
  const fields: any[] = [];
  const programme_fields: any[] = [];
  const modes: any[] = [];
  const programme_modes: any[] = [];
  const languages: any[] = [];
  const programme_languages: any[] = [];
  const locations: any[] = [];
  const programme_locations: any[] = [];

  for (const programme of degreeprogrammes) {
    // degrees
    const degree_id = programme.degree?.id || null;
    const degree_name = getTextDe(programme.degree?.name);
    if (degree_id && degree_name) degrees.push([degree_id, degree_name]);

    // degree_programmes
    const id = programme.id || null;
    const type = programme.type || null;
    const subject_name = getTextDe(programme.subject?.name);
    const institution_id = programme.institution?.id || null;
    const homepage = programme.homepage || null;
    const fee_amount = getTextDe(programme.fee?.name);
    const fee_comment = getTextDe(programme.fee?.comment?.name);
    const accredited =
      programme.accreditation?.accredited === "true" ? true : false;
    const comment = getTextDe(programme.comment?.name);
    const internal_degree = getTextDe(programme.internalDegree?.name);
    const master_type = getTextDe(programme.master_type?.name);
    const teachingdegrees =
      programme.teachingdegrees?.possible === "true" ? true : false;
    const duration = getTextDe(programme.duration?.name);
    const target_group = getTextDe(programme.target_group?.name);
    const admission_term = getTextDe(programme.admission_term?.name);
    const admission_mode = getTextDe(programme.admission_mode?.name);
    const admission_requirement = getTextDe(
      programme.admission_requirement?.name,
    );
    const admission_link = programme.admission_link || null;

    programmes.push([
      id,
      type,
      institution_id,
      fee_amount,
      fee_comment,
      accredited,
      homepage,
      comment,
      internal_degree,
      master_type,
      teachingdegrees,
      duration,
      target_group,
      admission_term,
      admission_mode,
      admission_requirement,
      admission_link,
      subject_name,
      degree_id,
    ]);

    // deadlines
    if (programme.deadlines?.deadline) {
      const deadlineArray = Array.isArray(programme.deadlines.deadline)
        ? programme.deadlines.deadline
        : [programme.deadlines.deadline];
      for (const d of deadlineArray) {
        deadlines.push([
          id,
          d.name || null,
          d.term || null,
          d.type || null,
          d.begin || null,
          d.end || null,
          getTextDe(d.comment?.name),
        ]);
      }
    }

    // disciplines & relations
    if (programme.disciplines?.discipline) {
      const arr = Array.isArray(programme.disciplines.discipline)
        ? programme.disciplines.discipline
        : [programme.disciplines.discipline];
      for (const d of arr) {
        if (d.id && getTextDe(d.name))
          disciplines.push([d.id, getTextDe(d.name)]);
        if (d.id) programme_disciplines.push([id, d.id]);
      }
    }

    // fields_of_study & relations
    if (programme.fields_of_study?.field_of_study) {
      const arr = Array.isArray(programme.fields_of_study.field_of_study)
        ? programme.fields_of_study.field_of_study
        : [programme.fields_of_study.field_of_study];
      for (const f of arr) {
        if (f.id && getTextDe(f.name)) fields.push([f.id, getTextDe(f.name)]);
        if (f.id) programme_fields.push([id, f.id]);
      }
    }

    // modes_of_study & relations
    if (programme.modes_of_study?.mode_of_study) {
      const arr = Array.isArray(programme.modes_of_study.mode_of_study)
        ? programme.modes_of_study.mode_of_study
        : [programme.modes_of_study.mode_of_study];
      for (const m of arr) {
        if (m.id && getTextDe(m.name)) modes.push([m.id, getTextDe(m.name)]);
        if (m.id) programme_modes.push([id, m.id]);
      }
    }

    // teaching_languages & relations
    if (programme.teaching_languages?.teaching_language) {
      const arr = Array.isArray(programme.teaching_languages.teaching_language)
        ? programme.teaching_languages.teaching_language
        : [programme.teaching_languages.teaching_language];
      for (const l of arr) {
        if (l.id && getTextDe(l.name))
          languages.push([l.id, getTextDe(l.name)]);
        if (l.id) programme_languages.push([id, l.id, l.isMain === "true"]);
      }
    }

    // locations & relations
    if (programme.locations?.location) {
      const arr = Array.isArray(programme.locations.location)
        ? programme.locations.location
        : [programme.locations.location];
      for (const loc of arr) {
        if (loc.id && getTextDe(loc.name))
          locations.push([loc.id, getTextDe(loc.name)]);
        if (loc.id) programme_locations.push([id, loc.id]);
      }
    }
  }

  try {
    await client.query("BEGIN");

    await batchInsert(client, "abschlussart", ["id", "name"], degrees, "(id)");
    await batchInsert(
      client,
      "studiengaenge",
      [
        "id",
        "typ",
        "hochschule_id",
        "studienbeitrag",
        "beitrag_kommentar",
        "akkreditiert",
        "homepage",
        "anmerkungen",
        "abschluss_intern",
        "mastertyp",
        "lehramtstypen",
        "regelstudienzeit",
        "zielgruppe",
        "zulassungssemester",
        "zulassungsmodus",
        "zulassungsvoraussetzungen",
        "zulassungs_link",
        "name",
        "abschlussart_id",
      ],
      programmes,
      "(id)",
    );
    await batchInsert(
      client,
      "fristen",
      [
        "studiengang_id",
        "name",
        "semester",
        "typ",
        "start",
        "ende",
        "kommentar",
      ],
      deadlines,
    );
    await batchInsert(
      client,
      "studienfelder",
      ["id", "name"],
      disciplines,
      "(id)",
    );
    await batchInsert(
      client,
      "studiengang_studienfelder_relation",
      ["studiengang_id", "studienfeld_id"],
      programme_disciplines,
      "(studiengang_id, studienfeld_id)",
    );
    await batchInsert(client, "schwerpunkte", ["id", "name"], fields, "(id)");
    await batchInsert(
      client,
      "studiengang_schwerpunkte_relation",
      ["studiengang_id", "schwerpunkt_id"],
      programme_fields,
      "(studiengang_id, schwerpunkt_id)",
    );
    await batchInsert(client, "studienform", ["id", "name"], modes, "(id)");
    await batchInsert(
      client,
      "studiengang_studienform_relation",
      ["studiengang_id", "studienform_id"],
      programme_modes,
      "(studiengang_id, studienform_id)",
    );
    await batchInsert(
      client,
      "unterrichtssprachen",
      ["id", "name"],
      languages,
      "(id)",
    );
    await batchInsert(
      client,
      "studiengang_sprachen_relation",
      ["studiengang_id", "sprache_id", "is_main"],
      programme_languages,
      "(studiengang_id, sprache_id)",
    );
    await batchInsert(client, "standorte", ["id", "name"], locations, "(id)");
    await batchInsert(
      client,
      "studiengang_standorte_relation",
      ["studiengang_id", "standort_id"],
      programme_locations,
      "(studiengang_id, standort_id)",
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
