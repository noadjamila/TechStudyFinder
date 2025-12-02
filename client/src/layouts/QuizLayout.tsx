import React from "react";
import Progressbar from "../components/quiz/Progressbar";
import { Box, useTheme } from "@mui/material";

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
}

/**
 * The `QuizLayout` is the base layout for all quiz pages.
 * It shows a progressbar und renders the embedded component (e.g. a quiz question).
 *
 * @example
 * <QuizLayout currentIndex={2} questionsTotal={10}>
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
}: QuizLayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          px: 2,
          py: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Progressbar
          current={currentIndex}
          total={questionsTotal}
          bgColor={theme.palette.quiz.progressBg}
          fillColor={theme.palette.quiz.progressFill}
        />

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default QuizLayout;
