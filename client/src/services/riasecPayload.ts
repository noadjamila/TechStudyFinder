/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { RiasecType } from "../types/RiasecTypes";

/**
 * Converts RIASEC scores to the API payload format.
 * @param scores - An object mapping RIASEC types to their scores.
 * @returns An array of objects, each containing a RIASEC type and its corresponding score.
 */
export function riasecScoresToApiPayload(scores: Record<RiasecType, number>) {
  return Object.entries(scores).map(([type, score]) => ({
    type: type as RiasecType,
    score,
  }));
}
