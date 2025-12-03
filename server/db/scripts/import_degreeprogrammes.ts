import fs from "fs";
import { parseStringPromise } from "xml2js";
import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Hilfsfunktion: deutsches Textfeld extrahieren
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

async function main() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });

  await client.connect();

  const xmlPath = path.join("db/scripts", "../xml/degreeprogrammes.xml");

  // Prüfen, ob Datei existiert
  if (!fs.existsSync(xmlPath)) {
    console.error("XML-Datei nicht gefunden:", xmlPath);
    process.exit(1);
  }

  const xmlData = fs.readFileSync(xmlPath, "utf-8");

  // XML parsen
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

    if (Array.isArray(delivery.degreeProgramme)) {
      degreeprogrammes.push(...delivery.degreeProgramme);
    } else {
      degreeprogrammes.push(delivery.degreeProgramme);
    }
  }
  if (degreeprogrammes.length === 0) {
    console.error("Keine Studiengänge im XML gefunden!");
    process.exit(1);
  }
  console.log(`✅ ${degreeprogrammes.length} Studiengänge geladen`);

  for (const programme of degreeprogrammes) {
    // subjects
    const subject_id = programme.subject?.id || null;
    const subject_name = getTextDe(programme.subject?.name);
    if (subject_id && subject_name) {
      await client.query(
        `INSERT INTO subjects (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
        [subject_id, subject_name],
      );
    }

    // degrees
    const degree_id = programme.degree?.id || null;
    const degree_name = getTextDe(programme.degree?.name);
    if (degree_id && degree_name) {
      await client.query(
        `INSERT INTO degrees (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
        [degree_id, degree_name],
      );
    }

    // degree_programmes
    const id = programme.id ? programme.id : null;
    const type = programme.type ? programme.type : null;
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
      programme.teachingdegress?.possible === "true" ? true : false;
    const duration = getTextDe(programme.duration?.name);
    const target_group = getTextDe(programme.target_group?.name);
    const admission_term = getTextDe(programme.admission_term?.name);
    const admission_mode = getTextDe(programme.admission_mode?.name);
    const admission_requirement = getTextDe(
      programme.admission_requirement?.name,
    );
    const admission_link = programme.admission_link || null;

    // insert degree_programmes
    try {
      await client.query(
        `INSERT INTO degree_programmes (
          id, type, institution_id, fee_amount, fee_comment, accredited, homepage, comment,
          internal_degree, master_type, teachingdegrees, duration, target_group, admission_term,
          admission_mode, admission_requirement, admission_link, subject_id, degree_id
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
        ) ON CONFLICT (id) DO NOTHING`,
        [
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
          subject_id,
          degree_id,
        ],
      );
      console.log(`Studiengang ${subject_name} (${id}) eingefügt`);
    } catch (error) {
      console.error(`Fehler bei Studiengang ${id}:`, error);
      process.exit(1);
    }

    // deadlines
    const deadlines = programme.deadlines;
    if (deadlines && deadlines.deadline) {
      const deadlineArray = Array.isArray(deadlines.deadline)
        ? deadlines.deadline
        : [deadlines.deadline];

      for (const deadline of deadlineArray) {
        const deadline_name = deadline.name ? deadline.name : null;
        const deadline_term = deadline.term ? deadline.term : null;
        const deadline_type = deadline.type ? deadline.type : null;
        const deadline_begin = deadline.begin ? deadline.begin : null;
        const deadline_end = deadline.end ? deadline.end : null;
        const deadline_comment = getTextDe(deadline.comment?.name);

        if (deadline_name) {
          await client.query(
            `INSERT INTO deadlines (degree_programme_id, name, term, type, begin_date, end_date, comment) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              id,
              deadline_name,
              deadline_term,
              deadline_type,
              deadline_begin,
              deadline_end,
              deadline_comment,
            ],
          );
        }
      }
    }

    // disciplines
    const disciplines = programme.disciplines;
    if (disciplines && disciplines.discipline) {
      const disciplineArray = Array.isArray(disciplines.discipline)
        ? disciplines.discipline
        : [disciplines.discipline];

      for (const discipline of disciplineArray) {
        const discipline_id = discipline.id || null;
        const discipline_name = getTextDe(discipline.name);

        const area_of_study_id = discipline.area_of_study?.id || null;
        const area_of_study_name = getTextDe(discipline.area_of_study?.name);
        if (area_of_study_id && area_of_study_name) {
          await client.query(
            `INSERT INTO areas_of_study (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [area_of_study_id, area_of_study_name],
          );
        }

        const subject_group_id = discipline.subject_group?.id || null;
        const subject_group_name = getTextDe(discipline.subject_group?.name);
        if (subject_group_id && subject_group_name) {
          await client.query(
            `INSERT INTO subject_groups (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [subject_group_id, subject_group_name],
          );
        }

        if (discipline_id && discipline_name) {
          await client.query(
            `INSERT INTO disciplines (id, name, area_of_study_id, subject_group_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
            [
              discipline_id,
              discipline_name,
              area_of_study_id,
              subject_group_id,
            ],
          );
        }

        // Many-to-Many Beziehung einfügen
        if (discipline_id) {
          await client.query(
            `INSERT INTO degree_programme_disciplines (degree_programme_id, discipline_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, discipline_id],
          );
        }
      }
    }

    // fields_of_study
    const fields_of_study = programme.fields_of_study;
    if (fields_of_study && fields_of_study.field_of_study) {
      const fieldArray = Array.isArray(fields_of_study.field_of_study)
        ? fields_of_study.field_of_study
        : [fields_of_study.field_of_study];

      for (const field of fieldArray) {
        const field_id = field.id || null;
        const field_name = getTextDe(field.name);

        if (field_id && field_name) {
          await client.query(
            `INSERT INTO fields_of_study (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [field_id, field_name],
          );
        }

        // Many-to-Many Beziehung einfügen
        if (field_id) {
          await client.query(
            `INSERT INTO degree_programme_studyfields (degree_programme_id, studyfield_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, field_id],
          );
        }
      }
    }

    // modes_of_study
    const modes_of_study = programme.modes_of_study;
    if (modes_of_study && modes_of_study.mode_of_study) {
      const modeArray = Array.isArray(modes_of_study.mode_of_study)
        ? modes_of_study.mode_of_study
        : [modes_of_study.mode_of_study];

      for (const mode of modeArray) {
        const mode_id = mode.id || null;
        const mode_name = getTextDe(mode.name);

        if (mode_id && mode_name) {
          await client.query(
            `INSERT INTO modes_of_study (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [mode_id, mode_name],
          );
        }

        // Many-to-Many Beziehung einfügen
        if (mode_id) {
          await client.query(
            `INSERT INTO degree_programme_modes (degree_programme_id, mode_of_study_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, mode_id],
          );
        }
      }
    }

    // teaching_languages
    const teaching_languages = programme.teaching_languages;
    if (teaching_languages && teaching_languages.teaching_language) {
      const langArray = Array.isArray(teaching_languages.teaching_language)
        ? teaching_languages.teaching_language
        : [teaching_languages.teaching_language];

      for (const lang of langArray) {
        const lang_id = lang.id || null;
        const lang_name = getTextDe(lang.name);
        const lang_isMain = lang.isMain === "true" ? true : false;

        if (lang_id && lang_name) {
          await client.query(
            `INSERT INTO teaching_languages (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [lang_id, lang_name],
          );
        }

        // Many-to-Many Beziehung einfügen
        if (lang_id) {
          await client.query(
            `INSERT INTO degree_programme_languages (degree_programme_id, teaching_language_id, is_main) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
            [id, lang_id, lang_isMain],
          );
        }
      }
    }

    // locations
    const locations = programme.locations;
    if (locations && locations.location) {
      const locationArray = Array.isArray(locations.location)
        ? locations.location
        : [locations.location];

      for (const location of locationArray) {
        const location_id = location.id || null;
        const location_name = getTextDe(location.name);

        if (location_id && location_name) {
          await client.query(
            `INSERT INTO locations (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
            [location_id, location_name],
          );
        }

        // Many-to-Many Beziehung einfügen
        if (location_id) {
          await client.query(
            `INSERT INTO degree_programme_locations (degree_programme_id, location_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [id, location_id],
          );
        }
      }
    }
  }

  await client.end();
  console.log("Import abgeschlossen!");
}

main().catch((err) => console.error(err));
