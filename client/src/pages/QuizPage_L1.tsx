import React, { useState } from "react";
import QuizLayout from "../layouts/QuizLayout";
import QuizCardBase from "../components/quiz/QuizCardBase";
import { postFilterLevel } from "../services/quizApi";

// Definiert das Interface für die Props
export interface QuizPageL1Props {
  onNextLevel?: (_ids: number[]) => void;
}

const L1_OPTIONS = [
  { label: "Möchtest du anfangen zu studieren?", value: "grundständig" },
  { label: "Möchtest du weiter studieren?", value: "weiterführend" },
];

export default function QuizPage_L1({ onNextLevel }: QuizPageL1Props) {
  const [selected, setSelected] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ruft die eltern-funktion auf
  async function handleNext() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await postFilterLevel({
        level: 1,
        answers: [{ studientyp: selected }],
      });
      console.log(res.ids);
      onNextLevel?.(res.ids);

      // res.ids enthält die gefilterten Studiengänge → weiter zu L2 und res.ids mitgeben
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Konnte Filter nicht anwenden",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <QuizLayout currentIndex={1} questionsTotal={1}>
      <QuizCardBase
        title="Studientyp"
        question="empty"
        options={L1_OPTIONS}
        selected={selected}
        onSelect={setSelected}
      />

      <div style={{ marginTop: 16 }}>
        <button disabled={!selected || loading} onClick={handleNext}>
          {loading ? "Bitte warten…" : "Weiter"}
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
    </QuizLayout>
  );
}
