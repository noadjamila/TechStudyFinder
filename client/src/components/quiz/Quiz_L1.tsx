import { useState } from "react";
import QuizLayout from "../../layouts/QuizLayout";
import SecondaryButton from "../buttons/SecondaryButton";
import BaseCard from "../cards/QuizCardBase";
import theme from "../../theme/theme";
import { postFilterLevel } from "../../api/quizApi";
import { Box, Stack } from "@mui/material";
import { Answer } from "../../types/QuizAnswer.types";

/**
 * Props for the Quiz_L1 component.
 * @interface QuizL1Props
 * @param {function} onAnswer - Callback to record the user's answer.
 * @param {function} onComplete - Callback to signal completion of level 1.
 */
export interface QuizL1Props {
  onAnswer: (answer: Answer) => void;
  level1ids: (_ids: string[]) => void;
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
export default function Quiz_L1({
  onAnswer,
  level1ids,
  onComplete,
}: QuizL1Props) {
  const [selected, setSelected] = useState<string | undefined>();

  const handleSelectAndNext = async (selectedType: string) => {
    setSelected(selectedType);

    onAnswer({
      questionId: "level1.studyType",
      value: selectedType,
      answeredAt: Date.now(),
    });

    try {
      const res = await postFilterLevel({
        level: 1,
        answers: [{ studientyp: selectedType }],
      });
      level1ids(res.ids);
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
          height={70}
          alt="Mascot"
          style={{
            alignSelf: "flex-start",
            marginLeft: "48px",
          }}
        />

        <BaseCard
          cardText="Möchtest du ..."
          cardColor={theme.palette.decorative.green}
        ></BaseCard>
      </Box>

      <Stack
        spacing={2}
        sx={{
          mt: 3,
          justifyContent: "center",
          padding: "0 2em",
        }}
      >
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
      </Stack>
    </QuizLayout>
  );
}
