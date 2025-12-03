import fs from "fs";
import { parseStringPromise } from "xml2js";
import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Hilfsfunktion: Textfeld auf Deutsch extrahieren
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

// Hilfsfunktion: Telefonnummer + Prefix
function getPhone(field: any): string | null {
  if (!field) return null;
  const prefix = field.prefix || "";
  const number = field._?.trim() || "";
  const full = (prefix + number).trim();
  return full.length > 0 ? full : null;
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

  const deliveries = Array.isArray(result.institutions.delivery)
    ? result.institutions.delivery
    : [result.institutions.delivery];

  let institutions: any[] = [];

  for (const delivery of deliveries) {
    if (!delivery.institution) continue;

    if (Array.isArray(delivery.institution)) {
      institutions.push(...delivery.institution);
    } else {
      institutions.push(delivery.institution);
    }
  }
  if (institutions.length === 0) {
    console.error("Keine Institutionen im XML gefunden!");
    process.exit(1);
  }

  for (const inst of institutions) {
    const id = inst.id ? parseInt(inst.id) : null;
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
      await client.query(
        `INSERT INTO institution_type (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
        [institution_type_id, institution_type_name],
      );
    }

    // institutional_control
    const institutional_control_id = inst.institutional_control?.id
      ? parseInt(inst.institutional_control.id)
      : null;
    const institutional_control_name = getTextDe(
      inst.institutional_control?.name,
    );

    if (institutional_control_id && institutional_control_name) {
      await client.query(
        `INSERT INTO institution_control (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
        [institutional_control_id, institutional_control_name],
      );
    }

    // institution einfügen
    try {
      await client.query(
        `INSERT INTO institutions (
          id, name, shortname, state, city, phone, fax, homepage, email, logo,
          institution_type_id, institutional_control_id, foundation_year, award_phd, award_habil, clinic,
          student_statistic
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
        ) ON CONFLICT (id) DO NOTHING`,
        [
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
        ],
      );
      console.log(`Institution ${name} (${id}) eingefügt`);
    } catch (error) {
      console.error(`Fehler bei Institution ${id}:`, error);
    }
  }

  await client.end();
  console.log("Import abgeschlossen!");
}

main().catch((err) => console.error(err));
