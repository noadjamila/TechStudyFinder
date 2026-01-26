-- Session table for express-session (used by connect-pg-simple)
-- This table is usually auto-created but we include it here for completeness
CREATE TABLE IF NOT EXISTS "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
) WITHOUT OIDS;

-- Create index on expire column for session cleanup
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
