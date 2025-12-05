import React, { useState } from "react";
import QuizLayout from "../layouts/QuizLayout";
import QuizCardBase from "../components/quiz/QuizCardBase";
import { postFilterLevel } from "../services/quizApi";
import QuizMascot from "../assets/Männchen_Home_Level1.png";

/** Callback function executed upon successful completion of the level.
 * It receives an array of filtered IDs from the backend. */

export interface QuizPageL1Props {
  onNextLevel?: (_ids: number[]) => void;
}

/**
 * Constants defining the options for the Level 1 question.
 * The value field is used in the API payload.
 */

const L1_OPTIONS = [
  { label: "ein Studium beginnen?", value: "grundständig" },
  { label: "dein Studium fortsetzen?", value: "weiterführend" },
  { label: "dich erstmal umschauen?", value: "all" },
];

/**
 * The QuizPage_L1 component handles the first question of the quiz.
 * It manages the user's selection and calls the filtering API to get
 * the initial set of filtered IDs.
 *
 * @param {QuizPageL1Props} { onNextLevel } The callback function to proceed to the next stage.
 * @returns {JSX.Element} The rendered Level 1 Quiz Page.
 */
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
        console.error("Mistake while filtering", err);
        alert("Error appeared during loading. Please try again.");
      }
    }, 800);
  };

  return (
    <QuizLayout currentIndex={1} questionsTotal={1} showBackButton={false}>
      <QuizCardBase
        question="Möchtest du..."
        options={L1_OPTIONS}
        selected={selected}
        onSelect={handleSelectAndNext}
        imageSrc={QuizMascot}
      />
    </QuizLayout>
  );
}
