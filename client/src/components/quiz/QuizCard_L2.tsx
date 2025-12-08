import React from "react";
import { Stack, Typography } from "@mui/material";
import BaseCard from "./BaseCard";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import theme from "../../theme/theme";

/**
 * Props for the QuizCard_L2 component.
 * Allows parent-components the interaction and modification of this component.
 * Contains the question text and a callback for when an option is selected.
 */
export interface QuizCardProps {
  question: string;
  onSelect: (option: "yes" | "no" | "skip") => void;
}

/**
 * A quiz card component for level 2 questions with "Yes", "No", and "Skip" options.
 *
 * @param question: The question text to display on the card.
 * @param onSelect: Callback function when an option is selected.
 * @constructor
 */
const QuizCard_L2: React.FC<QuizCardProps> = ({ question, onSelect }) => {
  return (
    <>
      <BaseCard
        question={question}
        sx={{
          height: {
            xs: 300,
            md: 200,
          },
        }}
      ></BaseCard>

      <Stack
        spacing={2}
        sx={{
          mt: 3,
          justifyContent: "center",
          padding: "0 2em",
        }}
      >
        <PrimaryButton
          label={"Ja"}
          onClick={() => onSelect("yes")}
          ariaText="Antwort Ja"
        />
        <SecondaryButton
          label={"Nein"}
          onClick={() => onSelect("no")}
          ariaText="Antwort Nein"
        />
        <Typography
          aria-label="Antwort Überspringen"
          onClick={() => onSelect("skip")}
          sx={{
            cursor: "pointer",
            color: theme.palette.text.skipButton,
            textAlign: "center",
            textDecoration: "underline",
            "&:hover": {
              color: theme.palette.text.primary,
            },
          }}
        >
          Überspringen
        </Typography>
      </Stack>
    </>
  );
};

export default QuizCard_L2;
