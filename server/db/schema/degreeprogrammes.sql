-- ------------------------------
-- Degree Programme Meta Tables
-- ------------------------------

CREATE TABLE subjects (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE degrees (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE subject_groups (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE areas_of_study (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE disciplines (
    id TEXT PRIMARY KEY,
    name TEXT,
    area_of_study_id TEXT REFERENCES areas_of_study(id),
    subject_group_id TEXT REFERENCES subject_groups(id)
);

CREATE TABLE fields_of_study (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE modes_of_study (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE teaching_languages (
    id TEXT PRIMARY KEY,
    name TEXT
);

CREATE TABLE locations (
    id TEXT PRIMARY KEY,
    name TEXT
);

-- ------------------------------
-- Degree Programmes
-- ------------------------------

CREATE TABLE degree_programmes (
    id TEXT PRIMARY KEY,
    type TEXT,
    subject_id TEXT REFERENCES subjects(id),
    homepage TEXT,
    fee_amount TEXT,
    fee_comment TEXT,
    accredited BOOLEAN,
    comment TEXT,
    institution_id TEXT REFERENCES institutions(id),
    internal_degree TEXT,
    degree_id TEXT REFERENCES degrees(id),
    master_type TEXT,
    teachingdegrees BOOLEAN,
    duration TEXT,
    target_group TEXT,
    admission_term TEXT,
    admission_mode TEXT,
    admission_requirement TEXT,
    admission_link TEXT
);

-- ------------------------------
-- Deadlines
-- ------------------------------

CREATE TABLE deadlines (
    id SERIAL PRIMARY KEY,
    degree_programme_id TEXT REFERENCES degree_programmes(id),
    name TEXT,
    term TEXT,
    type TEXT,
    begin_date DATE,
    end_date DATE,
    comment TEXT
);

-- ------------------------------
-- Many-to-Many Tables
-- ------------------------------

CREATE TABLE degree_programme_disciplines (
    degree_programme_id TEXT REFERENCES degree_programmes(id),
    discipline_id TEXT REFERENCES disciplines(id),
    PRIMARY KEY (degree_programme_id, discipline_id)
);

CREATE TABLE degree_programme_studyfields (
    degree_programme_id TEXT REFERENCES degree_programmes(id),
    studyfield_id TEXT REFERENCES fields_of_study(id),
    PRIMARY KEY (degree_programme_id, studyfield_id)
);

CREATE TABLE degree_programme_modes (
    degree_programme_id TEXT REFERENCES degree_programmes(id),
    mode_of_study_id TEXT REFERENCES modes_of_study(id),
    PRIMARY KEY (degree_programme_id, mode_of_study_id)
);

CREATE TABLE degree_programme_languages (
    degree_programme_id TEXT REFERENCES degree_programmes(id),
    teaching_language_id TEXT REFERENCES teaching_languages(id),
    is_main BOOLEAN,
    PRIMARY KEY (degree_programme_id, teaching_language_id)
);

CREATE TABLE degree_programme_locations (
    degree_programme_id TEXT REFERENCES degree_programmes(id),
    location_id TEXT REFERENCES locations(id),
    PRIMARY KEY (degree_programme_id, location_id)
);
