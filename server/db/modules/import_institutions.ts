/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import fs from "fs";
import { parseStringPromise } from "xml2js";
import { Client } from "pg";
import path from "path";
import { getTextDe, getPhone, batchInsert } from "./xml_import_helpers";

export async function importInstitutions(client: Client, xmlData?: string) {
  let xmlContent: string;

  if (xmlData) {
    // XML-Daten wurden direkt übergeben
    xmlContent = xmlData;
  } else {
    // Fallback: Datei vom Standard-Pfad lesen
    const xmlPath = path.join(__dirname, "../xml/institutions.xml");
    if (!fs.existsSync(xmlPath)) {
      throw new Error(`XML file not found: ${xmlPath}`);
    }
    xmlContent = fs.readFileSync(xmlPath, "utf-8");
  }

  const result = await parseStringPromise(xmlContent, {
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
    throw new Error("No institutions found!");
  }
  console.debug(`✅ ${institutions.length} institutions found.`);

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

    console.debug("Import succeeded!");
  } catch (err) {
    console.error("Import failed.", err);
    throw err;
  }
}
