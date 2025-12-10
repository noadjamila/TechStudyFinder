-- ------------------------------
-- Degree Programme Meta Tables
-- ------------------------------

CREATE TABLE abschlussart (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE studienfelder (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE schwerpunkte (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE studienform (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE unterrichtssprachen (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE standorte (
    id TEXT PRIMARY KEY,
    name TEXT
);

-- ------------------------------
-- Degree Programmes
-- ------------------------------

CREATE TABLE studiengaenge (
    id TEXT PRIMARY KEY,
    typ TEXT,
    name TEXT,
    homepage TEXT,
    studienbeitrag TEXT,
    beitrag_kommentar TEXT,
    akkreditiert BOOLEAN,
    anmerkungen TEXT,
    hochschule_id TEXT REFERENCES hochschule(id),
    abschluss_intern TEXT,
    abschlussart_id TEXT REFERENCES abschlussart(id),
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
    studiengang_id TEXT REFERENCES studiengaenge(id),
    name TEXT,
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
    studiengang_id TEXT REFERENCES studiengaenge(id),
    studienfeld_id TEXT REFERENCES studienfelder(id),
    PRIMARY KEY (studiengang_id, studienfeld_id)
);

CREATE TABLE studiengang_schwerpunkte_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id),
    schwerpunkt_id TEXT REFERENCES schwerpunkte(id),
    PRIMARY KEY (studiengang_id, schwerpunkt_id)
);

CREATE TABLE studiengang_studienform_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id),
    studienform_id TEXT REFERENCES studienform(id),
    PRIMARY KEY (studiengang_id, studienform_id)
);

CREATE TABLE studiengang_sprachen_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id),
    sprache_id TEXT REFERENCES unterrichtssprachen(id),
    is_main BOOLEAN,
    PRIMARY KEY (studiengang_id, sprache_id)
);

CREATE TABLE studiengang_standorte_relation (
    studiengang_id TEXT REFERENCES studiengaenge(id),
    standort_id TEXT REFERENCES standorte(id),
    PRIMARY KEY (studiengang_id, standort_id)
);
