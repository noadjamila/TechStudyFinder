import React from "react";
import Progressbar from "../components/quiz/Progressbar";
import { Box, useTheme } from "@mui/material";
import Zurueck_Button from "../components/buttons/Zurueck_Button";

/**
 * Props of {@link QuizLayout}.
 * Allows parent-components the interaction and modification of this component.
 */
export interface QuizLayoutProps {
  // The index of the current progress, used by the progressbar.
  currentIndex: number;
  // Total number of all questions/steps, used by the progressbar.
  questionsTotal: number;
  // Main content (react components) which is placed within the layout.
  children: React.ReactNode;
  // Function for the back Button to go back one Question.
  oneBack?: () => void;
  // Boolean to handle if the Back Button is be visible on a page.
  showBackButton?: boolean;
}

/**
 * The `QuizLayout` is the base layout for all quiz pages.
 * It shows a progressbar and a Back Button and renders the embedded component (e.g. a quiz question).
 *
 * @example
 * <QuizLayout currentIndex={2} questionsTotal={10} oneBack={goBack} showBackButton={true}>
 *   <Question />
 * </QuizLayout>
 *
 * @param {Object} props - Props of the layout.
 * @returns {JSX.Element} The rendered quiz-layout with progressbar and content component.
 */
const QuizLayout = ({
  currentIndex,
  questionsTotal,
  children,
  oneBack,
  showBackButton = true,
}: QuizLayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        mt: 2,
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420, px: 2, pt: 4 }}>
        {showBackButton && (
          <Zurueck_Button label="Zurück" onClick={oneBack} sx={{}} />
        )}
        <Progressbar
          current={currentIndex}
          total={questionsTotal}
          bgColor={theme.palette.quiz.progressUnfilled}
          fillColor={theme.palette.secondary.main}
        />

        <Box
          sx={{
            mt: 1,
            textAlign: "left",
            color: theme.palette.text.primary,
            fontSize: "0.9rem",
          }}
        >
          Frage {currentIndex} von {questionsTotal}
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          mt: 4,
          px: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default QuizLayout;
