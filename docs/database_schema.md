# Database Documentation

## 1. Overview

This database stores information about **institutions** (universities, colleges), **degree programmes**, their subjects, disciplines, teaching details, and related meta-information.

It is divided into **two main domains**:

1. Institutions (`institutions`, `institution_type`, `institution_control`)
2. Degree programmes (`degree_programmes`, `subjects`, `degrees`, `disciplines`, etc.)

**Database type:** PostgreSQL

---

## 2. Institutions

### Tables Overview

| Table               | Description                                       |
| ------------------- | ------------------------------------------------- |
| institution_type    | Types of institutions (e.g., university, college) |
| institution_control | Control or ownership (e.g., state, private)       |
| institutions        | Main table with all institutions                  |

### `institution_type`

| Column | Type    | PK  | Nullable | Description                  |
| ------ | ------- | --- | -------- | ---------------------------- |
| id     | INTEGER | ✅  | ❌       | Unique ID                    |
| name   | TEXT    | ❌  | ❌       | Name of the institution type |

### `institution_control`

| Column | Type    | PK  | Nullable | Description                  |
| ------ | ------- | --- | -------- | ---------------------------- |
| id     | INTEGER | ✅  | ❌       | Unique ID                    |
| name   | TEXT    | ❌  | ❌       | Name of the controlling body |

### `institutions`

| Column                   | Type    | PK  | FK                           | Nullable | Description            |
| ------------------------ | ------- | --- | ---------------------------- | -------- | ---------------------- |
| id                       | INTEGER | ✅  |                              | ❌       | Institution ID         |
| name                     | TEXT    |     |                              | ❌       | Full name              |
| shortname                | TEXT    |     |                              | ✅       | Abbreviation           |
| state                    | TEXT    |     |                              | ✅       | State                  |
| city                     | TEXT    |     |                              | ✅       | City                   |
| phone                    | TEXT    |     |                              | ✅       | Phone number           |
| fax                      | TEXT    |     |                              | ✅       | Fax number             |
| homepage                 | TEXT    |     |                              | ✅       | Website                |
| email                    | TEXT    |     |                              | ✅       | Contact email          |
| logo                     | TEXT    |     |                              | ✅       | Logo file/path         |
| institution_type_id      | INTEGER |     | ✅ → institution_type(id)    | ❌       | Type                   |
| institutional_control_id | INTEGER |     | ✅ → institution_control(id) | ❌       | Control type           |
| foundation_year          | INTEGER |     |                              | ✅       | Year founded           |
| award_phd                | BOOLEAN |     |                              | ✅       | Can award PhD          |
| award_habil              | BOOLEAN |     |                              | ✅       | Can award habilitation |
| clinic                   | BOOLEAN |     |                              | ✅       | Has a clinic           |
| student_statistic        | JSONB   |     |                              | ✅       | Student statistics     |

---

## 3. Degree Programmes

### Tables Overview

| Table               | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| subjects            | Subjects offered                                                             |
| degrees             | Degree types (Bachelor, Master, etc.)                                        |
| subject_groups      | Groups of subjects                                                           |
| areas_of_study      | Study areas                                                                  |
| disciplines         | Specific disciplines (linked to areas & subject groups)                      |
| fields_of_study     | Focus areas / study fields                                                   |
| modes_of_study      | Full-time, part-time, etc.                                                   |
| teaching_languages  | Languages of instruction                                                     |
| locations           | Campus or study locations                                                    |
| riasec_types        | RIASEC personality types for programmes                                      |
| degree_programmes   | Main degree programme table                                                  |
| Many-to-many tables | Link tables connecting programmes to disciplines, languages, locations, etc. |
| deadlines           | Important dates per programme                                                |

### Example: `degree_programmes`

| Column                | Type    | PK  | FK                    | Nullable | Description           |
| --------------------- | ------- | --- | --------------------- | -------- | --------------------- |
| id                    | TEXT    | ✅  |                       | ❌       | Degree programme ID   |
| type                  | TEXT    |     |                       | ✅       | Type of programme     |
| subject_id            | TEXT    |     | ✅ → subjects(id)     | ❌       | Main subject          |
| homepage              | TEXT    |     |                       | ✅       | Website               |
| fee_amount            | TEXT    |     |                       | ✅       | Tuition fees          |
| fee_comment           | TEXT    |     |                       | ✅       | Fee notes             |
| accredited            | BOOLEAN |     |                       | ✅       | Accreditation status  |
| comment               | TEXT    |     |                       | ✅       | Free-text comment     |
| institution_id        | TEXT    |     | ✅ → institutions(id) | ❌       | Institution           |
| internal_degree       | TEXT    |     |                       | ✅       | Internal degree name  |
| degree_id             | TEXT    |     | ✅ → degrees(id)      | ✅       | Degree type           |
| master_type           | TEXT    |     |                       | ✅       | Master programme type |
| teachingdegrees       | BOOLEAN |     |                       | ✅       | Teaching degree flag  |
| duration              | TEXT    |     |                       | ✅       | Duration of programme |
| target_group          | TEXT    |     |                       | ✅       | Target audience       |
| admission_term        | TEXT    |     |                       | ✅       | Admission term        |
| admission_mode        | TEXT    |     |                       | ✅       | Admission mode        |
| admission_requirement | TEXT    |     |                       | ✅       | Requirements          |
| admission_link        | TEXT    |     |                       | ✅       | Admission link        |

### Many-to-Many Tables

| Table                        | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| degree_programme_disciplines | Links programmes to disciplines                        |
| degree_programme_studyfields | Links programmes to fields of study                    |
| degree_programme_modes       | Links programmes to study modes                        |
| degree_programme_languages   | Links programmes to teaching languages, with main flag |
| degree_programme_locations   | Links programmes to campuses/locations                 |

### Deadlines

| Column              | Type   | Description                |
| ------------------- | ------ | -------------------------- |
| id                  | SERIAL | Primary key                |
| degree_programme_id | TEXT   | FK → degree_programmes(id) |
| name                | TEXT   | Name of the deadline       |
| term                | TEXT   | Term / semester            |
| type                | TEXT   | Type (e.g. graduate).      |
| begin_date          | DATE   | Start date                 |
| end_date            | DATE   | End date                   |
| comment             | TEXT   | Notes                      |
