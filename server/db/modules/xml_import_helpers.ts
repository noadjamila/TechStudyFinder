import { Client } from "pg";

/**
 *
 * @param nameField
 * @returns
 */
export function getTextDe(nameField: any): string | null {
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

/**
 *
 * @param field
 * @returns
 */
export function getPhone(field: any): string | null {
  if (!field) return null;
  const prefix = field.prefix || "";
  const number = field._?.trim() || "";
  const full = (prefix + number).trim();
  return full.length > 0 ? full : null;
}

/**
 * Batch insert rows into a PostgreSQL table with optional conflict handling.
 * @param client
 * @param table
 * @param columns
 * @param rows
 * @param conflict
 * @param batchSize
 */
export async function batchInsert(
  client: Client,
  table: string,
  columns: string[],
  rows: any[][],
  conflict?: string,
  batchSize: number = 500,
) {
  if (!rows.length) return;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

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
