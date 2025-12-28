import { useState } from "react";
import QuizLayout from "../../layouts/QuizLayout";
import SecondaryButton from "../buttons/SecondaryButton";
import BaseCard from "../BaseCard";
import theme from "../../theme/theme";
import { postFilterLevel } from "../../api/quizApi";
import { Box } from "@mui/material";
import { Answer } from "../../types/QuizAnswer.types";

/**
 * Props for the Quiz_L1 component.
 * @interface QuizL1Props
 * @param {function} onAnswer - Callback to record the user's answer.
 * @param {function} onComplete - Callback to signal completion of level 1.
 */
export interface QuizL1Props {
  onAnswer: (answer: Answer) => void;
  onComplete: () => void;
}

/**
 * The Quiz_L1 component handles the first question of the quiz.
 * It allows users to select their study type preference and
 * proceeds to the next level upon selection.
 *
 * @param {QuizL1Props} props - The component props.
 * @returns {JSX.Element} The rendered Level 1 quiz component.
 */
export default function Quiz_L1({ onAnswer, onComplete }: QuizL1Props) {
  const [selected, setSelected] = useState<string | undefined>();

  const handleSelectAndNext = async (selectedType: string) => {
    setSelected(selectedType);

    onAnswer({
      questionId: "level1.studyType",
      value: selectedType,
      answeredAt: Date.now(),
    });

    try {
      await postFilterLevel({
        level: 1,
        answers: [{ studientyp: selectedType }],
      });
      onComplete();
    } catch (err) {
      console.error("Mistake while filtering", err);
      alert("Error appeared during loading. Please try again.");
    }
  };

  return (
    <QuizLayout
      currentIndex={selected ? 1 : 0}
      questionsTotal={1}
      _showBackButton={false}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            marginLeft: "55px",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <BaseCard
            cardText="Möchtest du ..."
            sx={{
              pt: 2,
              pb: 4,
            }}
            cardColor={theme.palette.decorative.green}
          ></BaseCard>

          <Box sx={{ display: "grid", gap: 2, mt: 3 }}>
            <SecondaryButton
              label={"Ein Studium beginnen?"}
              onClick={() => handleSelectAndNext("undergraduate")}
            />
            <SecondaryButton
              label={"Einen Master studieren?"}
              onClick={() => handleSelectAndNext("graduate")}
            />
            <SecondaryButton
              label={"Dich erstmal umschauen?"}
              onClick={() => handleSelectAndNext("all")}
            />
          </Box>
        </Box>
      </Box>
    </QuizLayout>
  );
}
