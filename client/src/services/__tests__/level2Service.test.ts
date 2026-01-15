import { describe, it, expect } from "vitest";
import { convertQuizResponses } from "../level2Service";
import { RiasecType, initialScores } from "../../types/RiasecTypes";

describe("convertQuizResponses", () => {
  it("should transform minimum value (-6) to 1", () => {
    const input = {
      [RiasecType.R]: -6,
      [RiasecType.I]: 0,
      [RiasecType.A]: 0,
      [RiasecType.S]: 0,
      [RiasecType.E]: 0,
      [RiasecType.C]: 0,
    };

    const result = convertQuizResponses(input);

    expect(result[RiasecType.R]).toBe(1);
  });

  it("should transform maximum value (6) to 5", () => {
    const input = {
      [RiasecType.R]: 6,
      [RiasecType.I]: 0,
      [RiasecType.A]: 0,
      [RiasecType.S]: 0,
      [RiasecType.E]: 0,
      [RiasecType.C]: 0,
    };

    const result = convertQuizResponses(input);

    expect(result[RiasecType.R]).toBe(5);
  });

  it("should transform zero value to 3", () => {
    const input = {
      [RiasecType.R]: 0,
      [RiasecType.I]: 0,
      [RiasecType.A]: 0,
      [RiasecType.S]: 0,
      [RiasecType.E]: 0,
      [RiasecType.C]: 0,
    };

    const result = convertQuizResponses(input);

    expect(result[RiasecType.R]).toBe(3);
  });

  it("should transform all values in the valid range correctly", () => {
    const input = {
      [RiasecType.R]: -3,
      [RiasecType.I]: 3,
      [RiasecType.A]: -1,
      [RiasecType.S]: 1,
      [RiasecType.E]: -6,
      [RiasecType.C]: 6,
    };

    const result = convertQuizResponses(input);

    // -3 → 1 + ((-3 + 6) / 12) * 4 = 1 + 1 = 2
    expect(result[RiasecType.R]).toBe(2);
    // 3 → 1 + ((3 + 6) / 12) * 4 = 1 + 3 = 4
    expect(result[RiasecType.I]).toBe(4);
    // -1 → 1 + ((-1 + 6) / 12) * 4 = 1 + 5/3 ≈ 2.67
    expect(result[RiasecType.A]).toBeCloseTo(2.67, 2);
    // 1 → 1 + ((1 + 6) / 12) * 4 = 1 + 7/3 ≈ 3.33
    expect(result[RiasecType.S]).toBeCloseTo(3.33, 2);
    // -6 → 1
    expect(result[RiasecType.E]).toBe(1);
    // 6 → 5
    expect(result[RiasecType.C]).toBe(5);
  });

  it("should transform all RIASEC types independently", () => {
    const input = {
      [RiasecType.R]: -6,
      [RiasecType.I]: -3,
      [RiasecType.A]: 0,
      [RiasecType.S]: 3,
      [RiasecType.E]: 6,
      [RiasecType.C]: 2,
    };

    const result = convertQuizResponses(input);

    expect(result[RiasecType.R]).toBe(1);
    expect(result[RiasecType.I]).toBe(2);
    expect(result[RiasecType.A]).toBe(3);
    expect(result[RiasecType.S]).toBe(4);
    expect(result[RiasecType.E]).toBe(5);
    expect(result[RiasecType.C]).toBeCloseTo(3.67, 2);
  });

  it("should handle initialScores (all zeros)", () => {
    const result = convertQuizResponses(initialScores);

    Object.values(result).forEach((value) => {
      expect(value).toBe(3);
    });
  });

  it("should return a new object without mutating the input", () => {
    const input = {
      [RiasecType.R]: 3,
      [RiasecType.I]: -2,
      [RiasecType.A]: 0,
      [RiasecType.S]: 0,
      [RiasecType.E]: 0,
      [RiasecType.C]: 0,
    };

    const result = convertQuizResponses(input);

    expect(result).not.toBe(input);
    expect(input[RiasecType.R]).toBe(3);
    expect(input[RiasecType.I]).toBe(-2);
  });

  it("should handle edge case with all values at minimum", () => {
    const input = {
      [RiasecType.R]: -6,
      [RiasecType.I]: -6,
      [RiasecType.A]: -6,
      [RiasecType.S]: -6,
      [RiasecType.E]: -6,
      [RiasecType.C]: -6,
    };

    const result = convertQuizResponses(input);

    Object.values(result).forEach((value) => {
      expect(value).toBe(1);
    });
  });

  it("should handle edge case with all values at maximum", () => {
    const input = {
      [RiasecType.R]: 6,
      [RiasecType.I]: 6,
      [RiasecType.A]: 6,
      [RiasecType.S]: 6,
      [RiasecType.E]: 6,
      [RiasecType.C]: 6,
    };

    const result = convertQuizResponses(input);

    Object.values(result).forEach((value) => {
      expect(value).toBe(5);
    });
  });
});
