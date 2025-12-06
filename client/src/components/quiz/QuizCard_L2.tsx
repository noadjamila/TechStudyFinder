import React from "react";
import { Card, Typography, useTheme } from "@mui/material";
import QuizButtons_L2 from "../buttons/QuizButtons_L2";

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
 * This component displays a question with three answer options ("yes", "no", "skip").
 * The user can select an option, whereupon a short animation is played
 * before the result is passed to the parent component.
 *
 * @example
 * ```tsx
 * <QuizCard_L2
 *   question="..."
 *   onSelect={(answer) => handleSelect(answer)}
 * />
 * ```
 *
 * @param props - Props for the component.
 * @returns {JSX.Element} Interactive quiz card with three answer options.
 */
const QuizCard_L2: React.FC<QuizCardProps> = ({ question, onSelect }) => {
  const theme = useTheme();

  return (
    <>
      <Card
        sx={{
          width: "100%",
          height: "300px",
          maxWidth: 280,
          mx: "auto",
          boxSizing: "border-box",
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.quiz.cardBackground,
          pb: 3,
          px: 0.5,
          overflow: "visible",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80px",
            textAlign: "center",
            margin: "2em",
          }}
        >
          {question}
        </Typography>
      </Card>
      <QuizButtons_L2
        onYes={() => onSelect("yes")}
        onNo={() => onSelect("no")}
        onSkip={() => onSelect("skip")}
      />
    </>
  );
};

export default QuizCard_L2;
