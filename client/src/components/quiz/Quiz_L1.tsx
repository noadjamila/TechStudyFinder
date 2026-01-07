import { useState } from "react";
import QuizLayout from "../../layouts/QuizLayout";
import SecondaryButton from "../buttons/SecondaryButton";
import BaseCard from "../cards/QuizCardBase";
import theme from "../../theme/theme";
import { postFilterLevel } from "../../api/quizApi";
import { Box } from "@mui/material";
import { Stack } from "@mui/material";

/** Callback function executed upon successful completion of the level.
 * It receives an array of filtered IDs from the backend. */
export interface QuizL1Props {
  onNextLevel: (_ids: string[]) => void;
}

/**
 * The Quiz_L1 component handles the first question of the quiz.
 * It manages the user's selection and calls the filtering API to get
 * the initial set of filtered IDs.
 *
 * @param {QuizL1Props} { onNextLevel } The callback function to proceed to the next stage.
 * @returns {JSX.Element} The rendered Level 1 Quiz.
 */
export default function Quiz_L1({ onNextLevel }: QuizL1Props) {
  const [selected, setSelected] = useState<string | undefined>();

  const handleSelectAndNext = async (selectedType: string) => {
    setSelected(selectedType);

    setTimeout(async () => {
      try {
        const answersPayload: [{ studientyp: string }] = [
          { studientyp: selectedType },
        ];

        const res = await postFilterLevel({
          level: 1,
          answers: answersPayload,
        });
        onNextLevel(res.ids);
      } catch (err) {
        console.error("Mistake while filtering", err);
        alert("Error appeared during loading. Please try again.");
      }
    }, 800);
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
