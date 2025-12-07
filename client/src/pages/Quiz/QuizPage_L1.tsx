import React, { useState } from "react";
import QuizLayout from "../../layouts/QuizLayout";
import QuizCard_L1 from "../../components/quiz/QuizCard_L1";
import { postFilterLevel } from "../../api/quizApi";
import { Box } from "@mui/material";

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
    <QuizLayout currentIndex={selected ? 1 : 0} questionsTotal={1}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <img
          src="/mascot_standing_blue.svg"
          width={62}
          height={90}
          alt="Mascot"
          style={{
            alignSelf: "flex-start",
            marginLeft: "25px",
          }}
        />
        <QuizCard_L1
          question="Möchtest du..."
          options={L1_OPTIONS}
          selected={selected}
          onSelect={handleSelectAndNext}
        />
      </Box>
    </QuizLayout>
  );
}
