-- ------------------------------
-- Degree Programme Meta Tables
-- ------------------------------

CREATE TABLE abschlussart (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE studienfelder (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE schwerpunkte (
    id TEXT PRIMARY KEY, -- Ids in format = 'w6191'
    name TEXT NOT NULL
);

CREATE TABLE studienform (
    id TEXT PRIMARY KEY, -- Ids in format = 'v'
    name TEXT NOT NULL
);

CREATE TABLE unterrichtssprachen (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE standorte (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

-- ------------------------------
-- Degree Programmes
-- ------------------------------

CREATE TABLE studiengaenge (
    id TEXT PRIMARY KEY, -- Ids in format = 'g1234'
    typ TEXT,
    name TEXT NOT NULL,
    homepage TEXT,
    studienbeitrag TEXT,
    beitrag_kommentar TEXT,
    akkreditiert BOOLEAN,
    anmerkungen TEXT,
    hochschule_id INTEGER NOT NULL REFERENCES hochschule(id) ON DELETE CASCADE,
    abschluss_intern TEXT,
    abschlussart_id INTEGER NOT NULL REFERENCES abschlussart(id) ON DELETE CASCADE,
    mastertyp TEXT,
    lehramtstypen BOOLEAN,
    regelstudienzeit TEXT,
    zielgruppe TEXT,
    zulassungssemester TEXT,
    zulassungsmodus TEXT,
    zulassungsvoraussetzungen TEXT,
    zulassungs_link TEXT
);

-- ------------------------------
-- Deadlines
-- ------------------------------

CREATE TABLE fristen (
    id SERIAL PRIMARY KEY,
    studiengang_id TEXT REFERENCES studiengaenge(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    semester TEXT,
    typ TEXT,
    start DATE,
    ende DATE,
    kommentar TEXT
);

-- ------------------------------
-- Many-to-Many Tables
-- ------------------------------

CREATE TABLE studiengang_studienfelder_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id) ON DELETE CASCADE,
    studienfeld_id INTEGER REFERENCES studienfelder(id) ON DELETE CASCADE,
    PRIMARY KEY (studiengang_id, studienfeld_id)
);

CREATE TABLE studiengang_schwerpunkte_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id) ON DELETE CASCADE,
    schwerpunkt_id TEXT REFERENCES schwerpunkte(id) ON DELETE CASCADE,
    PRIMARY KEY (studiengang_id, schwerpunkt_id)
);

CREATE TABLE studiengang_studienform_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id) ON DELETE CASCADE,
    studienform_id TEXT REFERENCES studienform(id) ON DELETE CASCADE,
    PRIMARY KEY (studiengang_id, studienform_id)
);

CREATE TABLE studiengang_sprachen_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id) ON DELETE CASCADE,
    sprache_id INTEGER REFERENCES unterrichtssprachen(id) ON DELETE CASCADE,
    is_main BOOLEAN,
    PRIMARY KEY (studiengang_id, sprache_id)
);

CREATE TABLE studiengang_standorte_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id) ON DELETE CASCADE,
    standort_id INTEGER REFERENCES standorte(id) ON DELETE CASCADE,
    PRIMARY KEY (studiengang_id, standort_id)
);
