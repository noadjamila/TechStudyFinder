import { describe, expect, it } from "vitest";

import { calculateRiasecScores } from "../calculateRiasecScores";
import { riasecScoresToApiPayload } from "../riasecPayload";
import { AnswerMap } from "../../types/QuizAnswer.types";
import { RiasecType, initialScores } from "../../types/RiasecTypes";

describe("calculateRiasecScores", () => {
  it("returns a fresh copy of the initial scores when there are no answers", () => {
    const result = calculateRiasecScores({});

    expect(result).toEqual(initialScores);
    expect(result).not.toBe(initialScores);
  });

  it("sums yes/no/skip answers for level 2 questions and ignores other levels", () => {
    const answers: AnswerMap = {
      "level2.question.R": {
        questionId: "level2.question.R",
        value: "yes",
        answeredAt: 1,
      },
      "level2.question.I": {
        questionId: "level2.question.I",
        value: "no",
        answeredAt: 2,
      },
      "level2.question.A": {
        questionId: "level2.question.A",
        value: "skip",
        answeredAt: 3,
      },
      "level1.other": {
        questionId: "level1.other",
        value: "yes",
        answeredAt: 4,
      },
    };

    const result = calculateRiasecScores(answers);

    expect(result).toEqual({
      ...initialScores,
      [RiasecType.R]: 1,
      [RiasecType.I]: -1,
      [RiasecType.A]: 0,
    });
  });

  it("returns initial scores when only level 1 answers are provided", () => {
    const answers: AnswerMap = {
      "level1.question.R": {
        questionId: "level1.question.R",
        value: "yes",
        answeredAt: 1,
      },
      "level1.question.I": {
        questionId: "level1.question.I",
        value: "no",
        answeredAt: 2,
      },
    };

    const result = calculateRiasecScores(answers);

    expect(result).toEqual(initialScores);
  });

  it("uses the last segment of the question id to map answers to the same RIASEC bucket", () => {
    const answers: AnswerMap = {
      "level2.first.R": {
        questionId: "level2.first.R",
        value: "yes",
        answeredAt: 1,
      },
      "level2.second.R": {
        questionId: "level2.second.R",
        value: "yes",
        answeredAt: 2,
      },
    };

    const result = calculateRiasecScores(answers);

    expect(result[RiasecType.R]).toBe(2);
  });
});

describe("riasecScoresToApiPayload", () => {
  it("converts a score map into the API payload shape", () => {
    const scores = {
      ...initialScores,
      [RiasecType.R]: 2,
      [RiasecType.S]: -1,
    };

    const payload = riasecScoresToApiPayload(scores);

    expect(payload).toEqual(
      expect.arrayContaining([
        { type: RiasecType.R, score: 2 },
        { type: RiasecType.S, score: -1 },
        { type: RiasecType.I, score: 0 },
        { type: RiasecType.A, score: 0 },
        { type: RiasecType.E, score: 0 },
        { type: RiasecType.C, score: 0 },
      ]),
    );
  });
});
