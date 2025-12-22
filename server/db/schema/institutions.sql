DROP TABLE IF EXISTS hochschultyp CASCADE;
DROP TABLE IF EXISTS traegerschaft CASCADE;
DROP TABLE IF EXISTS hochschule CASCADE;

CREATE TABLE hochschultyp (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE traegerschaft (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE hochschule (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    kurzname TEXT,
    bundesland TEXT,
    stadt TEXT,
    telefon TEXT,
    fax TEXT,
    homepage TEXT,
    email TEXT,
    logo TEXT,
    hochschultyp_id INTEGER REFERENCES hochschultyp(id) ON DELETE CASCADE,
    traegerschaft_id INTEGER REFERENCES traegerschaft(id) ON DELETE CASCADE,
    gruendungsjahr INTEGER,
    promotionsrecht BOOLEAN,
    habilitationsrecht BOOLEAN,
    uniklinik BOOLEAN,
    student_statistik JSONB
);
