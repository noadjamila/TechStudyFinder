import React, { useState } from "react";
import QuizLayout from "../layouts/QuizLayout";
import QuizCardBase from "../components/quiz/QuizCardBase";
import { postFilterLevel } from "../services/quizApi";

export interface QuizPageL1Props {
  onNextLevel?: (_ids: number[]) => void;
}

const L1_OPTIONS = [
  { label: "ein Studium beginnen?", value: "grundständig" },
  { label: "dein Studium fortsetzen?", value: "weiterführend" },
  { label: "dich erstmal umschauen?", value: "all" },
];

//
export default function QuizPage_L1({ onNextLevel }: QuizPageL1Props) {
  const [selected, setSelected] = useState<string | undefined>();

  const handleSelectAndNext = async (selectedType: string) => {
    setSelected(selectedType);

    setTimeout(async () => {
      try {
        let answersPayload: [{ studientyp: string }] | [];

        if (selectedType === "all") {
          answersPayload = [];
        } else {
          answersPayload = [{ studientyp: selectedType }];
        }

        const res = await postFilterLevel({
          level: 1,
          answers: answersPayload,
        });

        onNextLevel?.(res.ids);
      } catch (err) {
        console.error("Fehler beim Filtern der Studiengänge:", err);
        alert("Beim Laden ist ein Fehler aufgetreten. Bitte erneut versuchen.");
      }
    }, 800);
  };

  return (
    <QuizLayout currentIndex={1} questionsTotal={1}>
      <QuizCardBase
        question="Möchtest du..."
        options={L1_OPTIONS}
        selected={selected}
        onSelect={handleSelectAndNext}
      />
    </QuizLayout>
  );
}
