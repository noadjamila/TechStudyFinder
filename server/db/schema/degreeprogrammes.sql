DROP TABLE IF EXISTS abschlussart CASCADE;
DROP TABLE IF EXISTS studiengebiete CASCADE;
DROP TABLE IF EXISTS studienfelder CASCADE;
DROP TABLE IF EXISTS schwerpunkte CASCADE;
DROP TABLE IF EXISTS studienform CASCADE;
DROP TABLE IF EXISTS unterrichtssprachen CASCADE;
DROP TABLE IF EXISTS standorte CASCADE;
DROP TABLE IF EXISTS studiengaenge CASCADE;
DROP TABLE IF EXISTS fristen CASCADE;
DROP TABLE IF EXISTS studiengang_studienfelder_relation CASCADE;
DROP TABLE IF EXISTS studiengang_schwerpunkte_relation CASCADE;
DROP TABLE IF EXISTS studiengang_studienform_relation CASCADE;
DROP TABLE IF EXISTS studiengang_sprachen_relation CASCADE;
DROP TABLE IF EXISTS studiengang_standorte_relation CASCADE;
DROP MATERIALIZED VIEW IF EXISTS studiengang_riasec_mv CASCADE;

-- ------------------------------
-- Degree Programme Meta Tables
-- ------------------------------

CREATE TABLE abschlussart (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE studiengebiete (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    riasec_r INTEGER,
    riasec_i INTEGER,
    riasec_a INTEGER,
    riasec_s INTEGER,
    riasec_e INTEGER,
    riasec_c INTEGER
);

CREATE TABLE studienfelder (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    studiengebiet_id INTEGER NOT NULL REFERENCES studiengebiete(id) ON DELETE CASCADE,
    riasec_override_r INTEGER,
    riasec_override_i INTEGER,
    riasec_override_a INTEGER,
    riasec_override_s INTEGER,
    riasec_override_e INTEGER,
    riasec_override_c INTEGER
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
    studiengang_id TEXT NOT NULL REFERENCES studiengaenge(id) ON DELETE CASCADE,
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

-- ------------------------------
-- RIASEC Materialized View
-- ------------------------------

CREATE MATERIALIZED VIEW studiengang_riasec_mv AS
SELECT
    sg.id   AS studiengang_id,
    sg.name AS studiengang_name,
    ROUND(AVG(COALESCE(sf.riasec_override_r, gz.riasec_r))) AS r_score,
    ROUND(AVG(COALESCE(sf.riasec_override_i, gz.riasec_i))) AS i_score,
    ROUND(AVG(COALESCE(sf.riasec_override_a, gz.riasec_a))) AS a_score,
    ROUND(AVG(COALESCE(sf.riasec_override_s, gz.riasec_s))) AS s_score,
    ROUND(AVG(COALESCE(sf.riasec_override_e, gz.riasec_e))) AS e_score,
    ROUND(AVG(COALESCE(sf.riasec_override_c, gz.riasec_c))) AS c_score
FROM studiengaenge sg
JOIN studiengang_studienfelder_relation rel
    ON sg.id = rel.studiengang_id
JOIN studienfelder sf
    ON sf.id = rel.studienfeld_id
JOIN studiengebiete gz
    ON gz.id = sf.studiengebiet_id
GROUP BY
    sg.id,
    sg.name;
