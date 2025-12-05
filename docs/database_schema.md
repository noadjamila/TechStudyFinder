# Database Documentation

## 1. Overview

This database stores information about **institutions** (universities, colleges), **degree programmes**, their subjects, disciplines, teaching details, and related meta-information.
For improved clarity of the data variables, the tables were named in German.

It is divided into **two main domains**:

1. Institutions (`hochschule`, `hochschultyp`, `traegerschaft`)
2. Degree programmes (`studiengaenge`, `abschlussart`, `studienfelder`, etc.)

**Database type:** PostgreSQL

---

## 2. Institutions

### Tables Overview

| Table         | Description                                       |
| ------------- | ------------------------------------------------- |
| hochschultyp  | Types of institutions (e.g., university, college) |
| traegerschaft | Control or ownership (e.g., state, private)       |
| hochschule    | Main table with all institutions                  |

### `hochschultyp`

| Column | Type    | PK  | Nullable | Description                  |
| ------ | ------- | --- | -------- | ---------------------------- |
| id     | INTEGER | ✅  | ❌       | Unique ID                    |
| name   | TEXT    | ❌  | ❌       | Name of the institution type |

### `traegerschaft`

| Column | Type    | PK  | Nullable | Description                  |
| ------ | ------- | --- | -------- | ---------------------------- |
| id     | INTEGER | ✅  | ❌       | Unique ID                    |
| name   | TEXT    | ❌  | ❌       | Name of the controlling body |

### `hochschule`

| Column             | Type    | PK  | FK                           | Nullable | Description            |
| ------------------ | ------- | --- | ---------------------------- | -------- | ---------------------- |
| id                 | INTEGER | ✅  |                              | ❌       | Institution ID         |
| name               | TEXT    |     |                              | ❌       | Full name              |
| kurzname           | TEXT    |     |                              | ✅       | Abbreviation           |
| bundesland         | TEXT    |     |                              | ✅       | State                  |
| stadt              | TEXT    |     |                              | ✅       | City                   |
| telefon            | TEXT    |     |                              | ✅       | Phone number           |
| fax                | TEXT    |     |                              | ✅       | Fax number             |
| homepage           | TEXT    |     |                              | ✅       | Website                |
| email              | TEXT    |     |                              | ✅       | Contact email          |
| logo               | TEXT    |     |                              | ✅       | Logo file/path         |
| hochschultyp_id    | INTEGER |     | ✅ → institution_type(id)    | ❌       | Type                   |
| traegerschaft_id   | INTEGER |     | ✅ → institution_control(id) | ❌       | Control type           |
| gruendungsjahr     | INTEGER |     |                              | ✅       | Year founded           |
| promotionsrecht    | BOOLEAN |     |                              | ✅       | Can award PhD          |
| habilitationsrecht | BOOLEAN |     |                              | ✅       | Can award habilitation |
| uniklinik          | BOOLEAN |     |                              | ✅       | Has a clinic           |
| student_statistik  | JSONB   |     |                              | ✅       | Student statistics     |

---

## 3. Degree Programmes

### Tables Overview

| Table               | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| abschlussart        | Degree types (Bachelor, Master, etc.)                                        |
| studienfelder       | Specific disciplines                                                         |
| schwerpunkte        | Focus areas / study fields                                                   |
| studienform         | Full-time, part-time, etc.                                                   |
| unterrichtssprachen | Languages of instruction                                                     |
| standorte           | Campus or study locations                                                    |
| studiengaenge       | Main degree programme table                                                  |
| Many-to-many tables | Link tables connecting programmes to disciplines, languages, locations, etc. |
| fristen             | Important dates per programme                                                |

### Example: `studiengaenge`

| Column                    | Type    | PK  | FK                    | Nullable | Description           |
| ------------------------- | ------- | --- | --------------------- | -------- | --------------------- |
| id                        | TEXT    | ✅  |                       | ❌       | Degree programme ID   |
| typ                       | TEXT    |     |                       | ✅       | Type of programme     |
| name                      | TEXT    |     |                       | ❌       | Main subject          |
| homepage                  | TEXT    |     |                       | ✅       | Website               |
| studienbeitrag            | TEXT    |     |                       | ✅       | Tuition fees          |
| beitrag_kommentar         | TEXT    |     |                       | ✅       | Fee notes             |
| akkreditiert              | BOOLEAN |     |                       | ✅       | Accreditation status  |
| anmerkungen               | TEXT    |     |                       | ✅       | Free-text comment     |
| hochschule_id             | TEXT    |     | ✅ → hochschule(id)   | ❌       | Institution           |
| abschluss_intern          | TEXT    |     |                       | ✅       | Internal degree name  |
| abschlussart_id           | TEXT    |     | ✅ → abschlussart(id) | ✅       | Degree type           |
| mastertyp                 | TEXT    |     |                       | ✅       | Master programme type |
| lehramtstypen             | BOOLEAN |     |                       | ✅       | Teaching degree flag  |
| regelstudienzeit          | TEXT    |     |                       | ✅       | Duration of programme |
| zielgruppe                | TEXT    |     |                       | ✅       | Target audience       |
| zulassungssemester        | TEXT    |     |                       | ✅       | Admission term        |
| zulassungsmodus           | TEXT    |     |                       | ✅       | Admission mode        |
| zulassungsvoraussetzungen | TEXT    |     |                       | ✅       | Requirements          |
| zulassungs_link           | TEXT    |     |                       | ✅       | Admission link        |

### Many-to-Many Tables

| Table                              | Description                                            |
| ---------------------------------- | ------------------------------------------------------ |
| studiengang_studienfelder_relation | Links programmes to disciplines                        |
| studiengang_schwerpunkte_relation  | Links programmes to fields of study                    |
| studiengang_studienform_relation   | Links programmes to study modes                        |
| studiengang_sprachen_relation      | Links programmes to teaching languages, with main flag |
| studiengang_standorte_relation     | Links programmes to campuses/locations                 |

### `fristen`

| Column         | Type   | Description            |
| -------------- | ------ | ---------------------- |
| id             | SERIAL | Primary key            |
| studiengang_id | TEXT   | FK → studiengaenge(id) |
| name           | TEXT   | Name of the deadline   |
| semester       | TEXT   | Term / semester        |
| typ            | TEXT   | Type (e.g. graduate).  |
| start          | DATE   | Start date             |
| ende           | DATE   | End date               |
| kommentar      | TEXT   | Notes                  |
