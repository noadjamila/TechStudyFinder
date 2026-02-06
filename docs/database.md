# Database Operations Guide

This document complements `docs/database-schema.md` with practical setup and handover notes.

## Environments

- **Local dev (Docker DB)**: `127.0.0.1:5434`
- **Test DB (Docker)**: `127.0.0.1:5434`, database `techstudyfinderdb_test`
- **Production (Docker DB)**: internal host `db:5432` inside Docker network

## Required objects

At minimum, the app expects these to exist:

- Tables: `users`, `favoriten`, `fragen_level_zwei`, `studiengaenge`, …
- View: `studiengang_full_view`
- Materialized view: `studiengang_riasec_mv`

Schema files live in `server/db/schema/`. See [Database Schema Documentation](docs/database-schema.md) for details.

## Initialize a fresh database

1. Ensure XML files are present in `server/db/xml/` (private data).
2. Run the init script:

```bash
cd server
npx ts-node db/scripts/init_data.ts
```

If you see errors about German date formats (e.g. `27.10.2025`), run with:

```bash
PGOPTIONS='-c datestyle=ISO,DMY' npx ts-node db/scripts/init_data.ts
```

## Level 2 questions

The quiz loads from `fragen_level_zwei`. The init script imports it from `server/db/data/fragen_level_zwei.csv` (comma-delimited, no header).

## Integration tests

Integration tests **drop tables**. They must run against a test DB only.
`npm run test:integration --workspace=server` uses `server/.env.test`.

Create the test DB once:

```bash
createdb -h 127.0.0.1 -p 5434 -U <user> techstudyfinderdb_test
```

Then load schema (minimum):

```bash
psql -h 127.0.0.1 -p 5434 -U <user> -d techstudyfinderdb_test \
  < server/db/schema/users.sql
psql -h 127.0.0.1 -p 5434 -U <user> -d techstudyfinderdb_test \
  < server/db/schema/favourites.sql
```
