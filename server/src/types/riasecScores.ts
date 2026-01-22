export type RiasecScores = {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
};

export interface RiasecData {
  studienfelder: any[];
  studiengebiete: any[];
  studiengaenge: any[];
}

export interface RiasecUpdate {
  table: "studienfelder" | "studiengebiete";
  id: number;
  changes: { [key: string]: number | null };
}
