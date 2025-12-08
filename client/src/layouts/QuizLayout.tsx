import React, { useState } from "react";
import Progressbar from "../components/quiz/Progressbar";
import { Box, useTheme } from "@mui/material";
import HomeButton from "../components/buttons/HomeButton";
import { useNavigate } from "react-router-dom";
import StyledDialog from "../components/dialogs/Dialog";

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
  const [openDialog, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
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
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "1fr auto auto",
              alignItems: "center",
              mb: 4,
            }}
          >
            <HomeButton />
            <HomeButton onClick={() => setDialogOpen(true)} />
          </Box>

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
      <StyledDialog
        open={openDialog}
        onClose={() => setDialogOpen(false)}
        title="Quiz beenden?"
        text="Deine Antworten gehen verloren."
        cancelLabel="NEIN"
        confirmLabel="JA"
        onConfirm={() => navigate("/")}
      />
    </>
  );
};

export default QuizLayout;
