import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import QuizButtons_L1 from "../buttons/QuizButtons_L1";
import { Box } from "@mui/material";

/**
 * Interface defining selectable options within the quiz card.
 * The radio buttons are the default, set to true, but can be set false, so they disappear.
 * Other buttons or actions can be implemented with the children prop.
 * @template T The type of the option's unique identifier (value).
 */
export interface QuizOption<T = string> {
  label: string;
  value: T;
  description?: string;
}

export interface QuizCardBaseProps<T = string> {
  question: string;
  onSelect: (value: T) => void;
  sx?: SxProps<Theme>;
}

/**
 * A generic, styled React component that renders a single question card
 * with a set of radio button options.
 *
 * It uses Material UI (MUI) components (Card, Radio, FormControlLabel, etc.)
 * and applies custom theming for radio button colors based on quizColorTheme.
 *
 * @template T The type of the option's unique identifier (value).
 * @param {QuizCardBaseProps<T>} props The props defining the card content and behavior.
 * @returns {JSX.Element} The Quiz Card component.
 */
const QuizCard_L1 = <T,>({ question, onSelect, sx }: QuizCardBaseProps<T>) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: 280,
        }}
      >
        <Card
          sx={{
            position: "relative",
            maxWidth: 600,
            width: "100%",
            mx: "auto",
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.decorative.green,
            color: theme.palette.text.primary,
            pt: 2,
            pb: 6,
            overflow: "visible",
            ...sx,
          }}
        >
          {/* the question*/}
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{ mt: 3, textAlign: "center" }}
          >
            {question}
          </Typography>
        </Card>
        <QuizButtons_L1
          startStudying={() => onSelect?.("grundständig" as T)}
          masterStudies={() => onSelect?.("weiterführend" as T)}
          lookAround={() => onSelect?.("all" as T)}
        />
      </Box>
    </>
  );
};

export default QuizCard_L1;
