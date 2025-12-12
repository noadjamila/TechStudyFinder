CREATE TABLE riasec_studiengebiet (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    riasec_r INTEGER NOT NULL,
    riasec_i INTEGER NOT NULL,
    riasec_a INTEGER NOT NULL,
    riasec_s INTEGER NOT NULL,
    riasec_e INTEGER NOT NULL,
    riasec_c INTEGER NOT NULL
);

CREATE TABLE riasec_studienfeld (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    studiengebiet_id INTEGER REFERENCES riasec_studiengebiet(id) ON DELETE CASCADE,
    riasec_override_r INTEGER,
    riasec_override_i INTEGER,
    riasec_override_a INTEGER,
    riasec_override_s INTEGER,
    riasec_override_e INTEGER,
    riasec_override_c INTEGER
);

CREATE MATERIALIZED VIEW studiengang_riasec_mv AS
SELECT
    sg.id AS studiengang_id,
    AVG(COALESCE(sf.riasec_override_r, gz.riasec_r)) AS r_score,
    AVG(COALESCE(sf.riasec_override_i, gz.riasec_i)) AS i_score,
    AVG(COALESCE(sf.riasec_override_a, gz.riasec_a)) AS a_score,
    AVG(COALESCE(sf.riasec_override_s, gz.riasec_s)) AS s_score,
    AVG(COALESCE(sf.riasec_override_e, gz.riasec_e)) AS e_score,
    AVG(COALESCE(sf.riasec_override_c, gz.riasec_c)) AS c_score

FROM studiengaenge sg
JOIN studiengang_studienfelder_relation rel
    ON sg.id = rel.studiengang_id
JOIN riasec_studienfeld sf
    ON sf.id = rel.studienfeld_id
JOIN riasec_studiengebiet gz
    ON gz.id = sf.studiengebiet_id

GROUP BY sg.id;

