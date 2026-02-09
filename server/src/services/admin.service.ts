/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { initializeDatabaseWithUpload } from "../../db/scripts/init_data_with_upload";
import {
  findAdminForLogin,
  getRiasecData,
  updateRiasecData,
} from "../repositories/admin.repository";
import { RiasecUpdate } from "../types/riasecScores";

interface UploadFiles {
  institutionsXml: string;
  degreeprogrammesXml: string;
}

/**
 * Processes the uploaded XML files and initializes the database.
 * @param institutionsXml XML content for institutions
 * @param degreeprogrammesXml XML content for degree programmes
 * @throws Error if the XML format is invalid or processing fails
 */
export async function processUploadFiles({
  institutionsXml,
  degreeprogrammesXml,
}: UploadFiles): Promise<void> {
  // Grundlegende XML-Validierung
  if (
    !institutionsXml.trim().startsWith("<") ||
    !degreeprogrammesXml.trim().startsWith("<")
  ) {
    throw new Error("INVALID_XML_FORMAT");
  }

  // Datenbank-Initialisierung
  await initializeDatabaseWithUpload(institutionsXml, degreeprogrammesXml);
}

/**
 * Fetches all RIASEC-related data from the database.
 * This includes:
 * - `studiengebiete`
 * - `studienfelder`
 * - `studiengaenge`
 *
 * @returns {Promise<Array>} An array containing all rows from the three RIASEC tables.
 * @throws Will throw an error if the database query fails.
 */
export async function handleGetRiasecData() {
  try {
    return await getRiasecData();
  } catch (error) {
    console.error("Fehler beim Abrufen der RIASEC-Daten:", error);
    throw error;
  }
}

/**
 * Updates an item in one of the RIASEC tables.
 *
 * @param {RiasecUpdate} riasecUpdates - Object containing the fields to update and their new values.
 * @returns {Promise<void>} Resolves when the update is successful.
 * @throws Will throw an error if the update operation fails.
 */
export async function handleEditRiasecData(riasecUpdates: RiasecUpdate) {
  try {
    await updateRiasecData(riasecUpdates);
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Riasec-Daten: ", err);
    throw err;
  }
}

/**
 * Admin Login
 */
export async function handleLogin(username: string, password: string) {
  const admin = await findAdminForLogin(username, password);
  if (!admin) {
    throw new Error("INVALID");
  }
  return admin;
}
