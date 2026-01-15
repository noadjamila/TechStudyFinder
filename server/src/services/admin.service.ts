import { initializeDatabaseWithUpload } from "../../db/scripts/init_data_with_upload";

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
