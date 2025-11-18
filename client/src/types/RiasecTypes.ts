/**
 * Enumeration representing the six RIASEC personality types
 * used in the Holland occupational interest model.
 *
 * @enum {string}
 * @example
 * const type: RiasecType = RiasecType.R; // "R"
 */
/* eslint-disable no-unused-vars */
export enum RiasecType {
  R = "R",
  I = "I",
  A = "A",
  S = "S",
  E = "E",
  C = "C",
}
/* eslint-enable no-unused-vars */

/**
 * The initial score state for all RIASEC types.
 *
 * Used as a baseline when initializing quiz results.
 * Each type starts with a score of `0` and is incremented
 * or decremented as the user answers quiz questions.
 *
 * @constant
 * @type {Record<RiasecType, number>}
 * @example
 * const scores = { ...initialScores };
 * // { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
 */
export const initialScores: Record<RiasecType, number> = {
  [RiasecType.R]: 0,
  [RiasecType.I]: 0,
  [RiasecType.A]: 0,
  [RiasecType.S]: 0,
  [RiasecType.E]: 0,
  [RiasecType.C]: 0,
};
