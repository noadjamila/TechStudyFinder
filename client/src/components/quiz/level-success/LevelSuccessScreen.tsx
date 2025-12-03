import { useEffect, useState } from "react";
import styles from "./LevelSuccessScreen.module.css";

type Level = 1 | 2 | 3;

export type LevelSuccessScreenProps = {
  currentLevel: Level;

  onContinue: () => void;
};

const NEXT_LEVEL_TEXT: Record<Level, string> = {
  1: "Interessenbasierte Orientierung (RISEC)",
  2: "Vertiefende Fachinteressen / Spezialisierung",
  3: "Du hast alle Level abgeschlossen",
};

export default function LevelSuccessScreen({
  currentLevel,
  onContinue,
}: LevelSuccessScreenProps) {
  const [phase, setPhase] = useState<"won" | "next">("won");

  useEffect(() => {
    const id = setTimeout(() => setPhase("next"), 1200);
    return () => clearTimeout(id);
  }, [currentLevel]);

  const nextText =
    currentLevel === 3
      ? NEXT_LEVEL_TEXT[3]
      : NEXT_LEVEL_TEXT[(currentLevel + 1) as Level];

  return (
    <div className={styles.wrapper}>
      <div role="dialog" aria-labelledby="ls-title" className={styles.card}>
        <h2
          id="ls-title"
          className={`${styles.title} ${
            phase === "won" ? styles.visible : styles.hidden
          }`}
          aria-live="polite"
        >
          Level1 {currentLevel} geschafft!
        </h2>

        <h2
          className={`${styles.title} ${
            phase === "next" ? styles.visible : styles.hidden
          }`}
          aria-live="polite"
        >
          {nextText}
        </h2>

        <div className={styles.actions}>
          <button type="button" onClick={onContinue} className={styles.button}>
            Weiter
          </button>
        </div>
      </div>
    </div>
  );
}
