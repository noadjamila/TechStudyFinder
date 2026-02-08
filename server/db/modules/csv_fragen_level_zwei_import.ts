/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Client } from "pg";
import fs from "fs";
import { from as copyFrom } from "pg-copy-streams";

async function copyCsvIntoTable(csvPath: string, client: Client) {
  return new Promise<void>((resolve, reject) => {
    const stream = client.query(
      copyFrom(
        "COPY public.fragen_level_zwei (id, text, riasec_type) FROM STDIN WITH (FORMAT csv, HEADER false, DELIMITER ',', NULL 'NULL')",
      ),
    );

    fs.createReadStream(csvPath)
      .pipe(stream)
      .on("finish", resolve)
      .on("error", reject);
  });
}

export async function importFragenLevelZweiCsv(
  csvPath: string,
  client: Client,
) {
  await client.query("TRUNCATE TABLE public.fragen_level_zwei;");
  await copyCsvIntoTable(csvPath, client);

  await client.query(`
    SELECT setval(
      pg_get_serial_sequence('public.fragen_level_zwei', 'id'),
      COALESCE((SELECT MAX(id) FROM public.fragen_level_zwei), 1),
      (SELECT MAX(id) FROM public.fragen_level_zwei) IS NOT NULL
    );
  `);
}
