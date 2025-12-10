import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Level = 1 | 2 | 3 | 4;

export type LevelSuccessScreenProps = {
  currentLevel: Level;
  onContinue?: () => void;
};

const NEXT_LEVEL_TEXT: Record<Level, string> = {
  1: "Deine Rahmenbedingungen",
  2: "Deine Interessen",
  3: "Dein Arbeitsstil",
  4: "Du hast alle Schritte abgeschlossen",
};

/**
 * LevelSuccessScreen component displays a screen showing the progress of the user through the different levels.
 * It shows a title for the current level and the description for the next level.
 * After each level is completed, the description for the next level is shown after a brief delay.
 * When the user reaches the final level, a message indicating completion is displayed.
 */

export default function LevelSuccessScreen({
  currentLevel,
}: LevelSuccessScreenProps) {
  const [phase, setPhase] = useState<"won" | "next">("won");
  const theme = useTheme();

  // Use the effect hook to switch the phase after 1.2 seconds, so that the description for the next level appears.
  useEffect(() => {
    if (currentLevel === 1) {
      setPhase("next");
    } else {
      const id = setTimeout(() => setPhase("next"), 1200);
      return () => clearTimeout(id);
    }
  }, [currentLevel]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        padding: theme.spacing(2),
      }}
    >
      {currentLevel === 1 ? (
        <>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              fontSize: "3rem",
              fontFamily: theme.typography.fontFamily,
            }}
            aria-live="polite"
          >
            Schritt 1
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(1),
              fontWeight: "bold",
              fontFamily: theme.typography.h6.fontFamily,
            }}
            aria-live="polite"
          >
            {NEXT_LEVEL_TEXT[1]}
          </Typography>
        </>
      ) : currentLevel === 2 ? (
        <>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(1),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              fontSize: "3rem",
              display: phase === "won" ? "block" : "none",
              fontFamily: theme.typography.fontFamily,
            }}
            aria-live="polite"
          >
            Schritt 1
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(0.5),
              fontWeight: "bold",
              fontSize: "3rem",
              display: phase === "won" ? "block" : "none",
              fontFamily: theme.typography.h6.fontFamily,
            }}
            aria-live="polite"
          >
            geschafft!
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(2),
              display: phase === "next" ? "block" : "none",
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              fontSize: "3rem",
              fontFamily: theme.typography.fontFamily,
            }}
            aria-live="polite"
          >
            Schritt 2
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(2),
              display: phase === "next" ? "block" : "none",
              fontFamily: theme.typography.h6.fontFamily,
            }}
            aria-live="polite"
          >
            {NEXT_LEVEL_TEXT[2]}
          </Typography>
        </>
      ) : currentLevel === 3 ? (
        <>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(2),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              fontSize: "3rem",
              display: phase === "won" ? "block" : "none",
              fontFamily: theme.typography.fontFamily,
            }}
            aria-live="polite"
          >
            Schritt 2
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(0.5),
              fontWeight: "bold",
              fontSize: "3rem",
              display: phase === "won" ? "block" : "none",
              fontFamily: theme.typography.h6.fontFamily,
            }}
            aria-live="polite"
          >
            geschafft!
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(2),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              fontSize: "3rem",
              display: phase === "next" ? "block" : "none",
              fontFamily: theme.typography.fontFamily,
            }}
            aria-live="polite"
          >
            Schritt 3
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(2),
              display: phase === "next" ? "block" : "none",
              fontFamily: theme.typography.h6.fontFamily,
            }}
            aria-live="polite"
          >
            {NEXT_LEVEL_TEXT[3]}
          </Typography>
        </>
      ) : currentLevel === 4 ? (
        <>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(2),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              fontSize: "3rem",
              fontFamily: theme.typography.fontFamily,
            }}
            aria-live="polite"
          >
            Schritt 3
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(2),
              fontFamily: theme.typography.h6.fontFamily,
            }}
            aria-live="polite"
          >
            {NEXT_LEVEL_TEXT[4]}
          </Typography>
        </>
      ) : null}
    </Box>
  );
}
