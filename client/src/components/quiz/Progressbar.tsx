/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import React from "react";

/**
 * Props for {@link Progressbar}
 * Allows parent-components the interaction and modification of this component.
 */
export interface ProgressbarProps {
  // Current progress, specified as a number between `0` and `total`.
  // Values less than 0 or greater than `total` are automatically limited.
  current: number;
  // Total number of steps.
  // Needs to be greater than 0 so that percentage progress can be calculated.
  total: number;
  bgColor?: string;
  fillColor?: string;
}

/**
 * This component displays a horizontal bar that shows progress based on the
 * current and total number of steps.
 *
 * @example
 * ```tsx
 * <Progressbar current={3} total={10} />
 * ```
 *
 * @param props - Props of the component.
 * @returns {JSX.Element} A visual progress element with text display (e.g., “Question 3 of 10”).
 */
const Progressbar: React.FC<ProgressbarProps> = ({
  current,
  total,
  bgColor,
  fillColor,
}) => {
  // Limits the current value so that it never falls below 0 or exceeds the total number.
  const safeCurrent = Math.max(0, Math.min(current, total));

  // Calculates the current percentage progress
  const progress = total > 0 ? (safeCurrent / total) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={safeCurrent}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Frage ${safeCurrent} von ${total}`}
      style={{
        height: 10,
        borderRadius: 5,
        backgroundColor: bgColor,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          borderRadius: 5,
          backgroundColor: fillColor,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
};

export default Progressbar;
