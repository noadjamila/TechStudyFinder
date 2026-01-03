export interface StudyProgramme {
  studiengang_id: string;
  name: string;
  hochschule: string;
  abschluss: string;
  homepage?: string | null;
  studienbeitrag?: string | null;
  beitrag_kommentar?: string | null;
  anmerkungen?: string | null;
  regelstudienzeit?: string | null;
  zulassungssemester?: string | null;
  zulassungsmodus?: string | null;
  zulassungsvoraussetzungen?: string | null;
  zulassungslink?: string | null;
  schwerpunkte?: string[] | null;
  sprachen?: string[] | null;
  standorte?: string[] | null;
  studienfelder?: string[] | null;
  studienform?: string[] | null;
}
