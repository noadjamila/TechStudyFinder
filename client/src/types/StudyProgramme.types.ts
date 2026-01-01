export interface StudyProgramme {
  id: number;
  name: string;
  hochschule: string;
  abschluss: string;
  homepage: string;
  studienbeitrag: string;
  beitrag_kommentar: string;
  anmerkungen: string;
  regelstudienzeit: string;
  zulassungssemester: string;
  zulassungsmodus: string;
  zulassungsvoraussetzungen: string;
  zulassungslink: string;
  schwerpunkte: string[];
  sprachen: string[];
  standorte: string[];
  studienfelder: string[];
  studienform: string[];
}
