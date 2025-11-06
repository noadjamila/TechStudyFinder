export enum RiasecType {
  R = "R",
  I = "I",
  A = "A",
  S = "S",
  E = "E",
  C = "C",
}

export const initialScores: Record<RiasecType, number> = {
  [RiasecType.R]: 0,
  [RiasecType.I]: 0,
  [RiasecType.A]: 0,
  [RiasecType.S]: 0,
  [RiasecType.E]: 0,
  [RiasecType.C]: 0,
};
