import React from "react";
import { SxProps, Theme } from "@mui/material/styles";
import { Box } from "@mui/material";
import BaseCard from "../BaseCard";
import SecondaryButton from "../buttons/SecondaryButton";
import theme from "../../theme/theme";

/**
 * Props for the QuizCard_L1 component.
 * Allows parent-components the interaction and modification of this component.
 * Contains the question text and a callback for when an option is selected.
 */
export interface QuizCardL1Props<T = string> {
  question: string;
  onSelect: (value: T) => void;
  sx?: SxProps<Theme>;
}

/**
 * A quiz card component for level 1 questions with three answer options.
 *
 * @param question: The question text to display on the card.
 * @param onSelect: Callback function when an option is selected.
 * @constructor
 */
const QuizCard_L1 = <T,>({ question, onSelect }: QuizCardL1Props<T>) => {
  return (
    <>
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
          cardText={question}
          sx={{
            pt: 2,
            pb: 4,
          }}
          cardColor={theme.palette.decorative.green}
        ></BaseCard>

        <Box sx={{ display: "grid", gap: 2, mt: 3 }}>
          <SecondaryButton
            label={"Ein Studium beginnen?"}
            onClick={() => onSelect?.("grundständig" as T)}
          />
          <SecondaryButton
            label={"Einen Master studieren?"}
            onClick={() => onSelect?.("weiterführend" as T)}
          />
          <SecondaryButton
            label={"Dich erstmal umschauen?"}
            onClick={() => onSelect?.("all" as T)}
          />
        </Box>
      </Box>
    </>
  );
};

export default QuizCard_L1;
