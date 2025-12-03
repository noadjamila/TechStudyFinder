
CREATE TABLE institution_type (
	id INTEGER PRIMARY KEY,
	name TEXT
);

CREATE TABLE institution_control (
	id INTEGER PRIMARY KEY,
	name TEXT
);

CREATE TABLE institutions (
    id INTEGER PRIMARY KEY,
    name TEXT,
    shortname TEXT,
    state TEXT,
    city TEXT,
    phone TEXT,
    fax TEXT,
    homepage TEXT,
    email TEXT,
    logo TEXT,
    institution_type_id INTEGER REFERENCES institution_type(id),
    institutional_control_id INTEGER REFERENCES institution_control(id),
    foundation_year INTEGER,
    award_phd BOOLEAN,
    award_habil BOOLEAN,
    clinic BOOLEAN,
    student_statistic JSONB
);
