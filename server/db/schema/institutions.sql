
CREATE TABLE hochschultyp (
	id INTEGER PRIMARY KEY,
	name TEXT
);

CREATE TABLE traegerschaft (
	id INTEGER PRIMARY KEY,
	name TEXT
);

CREATE TABLE hochschule (
    id TEXT PRIMARY KEY,
    name TEXT,
    kurzname TEXT,
    bundesland TEXT,
    stadt TEXT,
    telefon TEXT,
    fax TEXT,
    homepage TEXT,
    email TEXT,
    logo TEXT,
    hochschultyp_id INTEGER REFERENCES hochschultyp(id),
    traegerschaft_id INTEGER REFERENCES traegerschaft(id),
    gruendungsjahr INTEGER,
    promotionsrecht BOOLEAN,
    habilitationsrecht BOOLEAN,
    uniklinik BOOLEAN,
    student_statistik JSONB
);
