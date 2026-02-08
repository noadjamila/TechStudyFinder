/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { RiasecType } from "../types/RiasecTypes";

/**
 * Converts user RIASEC quiz responses from the range [-6, 6]
 * to the standardized range [1, 5] used for study program mapping.
 *
 * This transformation ensures that the user scores are compatible
 * with the predefined RIASEC scores of study programs, allowing
 * for stable cosine similarity calculations.
 *
 * @param response - An object mapping each RIASEC type to a user's raw quiz score
 *                   in the range [-6, 6].
 * @returns A new object mapping each RIASEC type to a transformed score in the range [1, 5].
 */
export function convertQuizResponses(
  response: Record<RiasecType, number>,
): Record<RiasecType, number> {
  const transformed = {} as Record<RiasecType, number>;

  (Object.entries(response) as [RiasecType, number][]).forEach(
    ([key, value]) => {
      const clamped = Math.max(-6, Math.min(6, value));

      transformed[key] = 1 + ((clamped + 6) / 12) * 4;
    },
  );

  return transformed;
}

/**
 * Converts the scores object into an array of type-score pairs.
 *
 * @param {Record<RiasecType, number>} scores - The RIASEC scores.
 * @returns {{ type: RiasecType; score: number }[]} Array of type-score objects.
 */
export const scoresToArray = (
  scores: Record<RiasecType, number>,
): { type: RiasecType; score: number }[] => {
  return Object.entries(scores).map(([type, score]) => ({
    type: type as RiasecType,
    score,
  }));
};
