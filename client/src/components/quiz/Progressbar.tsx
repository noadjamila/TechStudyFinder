import React from "react";
import styles from "./Progressbar.module.css";

/**
 * Props for {@link Progressbar}
 * Allows parent-components the interaction and modification of this component.
 */
export interface ProgressbarProps {
  /**
   * Current progress.
   *
   * - Specified as a number between `0` and `total`.
   * - Values less than 0 or greater than `total` are automatically limited.
   */
  current: number;

  /**
   * Total number of steps.
   *
   * - Needs to be greater than 0 so that percentage progress can be calculated.
   */
  total: number;
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
const Progressbar: React.FC<ProgressbarProps> = ({ current, total }) => {
  // Limits the current value so that it never falls below 0 or exceeds the total number.
  const safeCurrent = Math.max(0, Math.min(current, total));

  // Calculates the current percentage progress
  const percent = total > 0 ? (safeCurrent / total) * 100 : 0;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.bar}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={safeCurrent}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>

      <span className={styles.fraction}>
        Frage {safeCurrent} von {total}
      </span>
    </div>
  );
};

export default Progressbar;
