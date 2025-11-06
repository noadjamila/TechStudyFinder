import React from "react";
import styles from "./Progressbar.module.css";

export interface ProgressbarProps {
  current: number;
  total: number;
}

const Progressbar: React.FC<ProgressbarProps> = ({ current, total }) => {
  const safeCurrent = Math.max(0, Math.min(current, total));
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
