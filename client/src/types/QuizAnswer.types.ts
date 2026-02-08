/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

export type Answer = {
  questionId: string;
  value: string | number | boolean;
  answeredAt: number;
};

export type AnswerMap = Record<string, Answer>;
