import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Use the effect hook to switch the phase after 1.8 seconds, so that the description for the next level appears.
  useEffect(() => {
    if (currentLevel === 1) {
      setPhase("next");
      const id = setTimeout(() => {
        navigate("/quiz/level/1");
      }, 1800);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => setPhase("next"), 1800);
      return () => clearTimeout(id);
    }
  }, [currentLevel, navigate]);

  // After phase changes to "next", navigate to the next quiz level
  useEffect(() => {
    if (phase === "next") {
      if (currentLevel === 2) {
        const id = setTimeout(() => {
          navigate("/quiz/level/2");
        }, 2500);
        return () => clearTimeout(id);
      } else if (currentLevel === 3) {
        const id = setTimeout(() => {
          navigate("/quiz/level/3");
        }, 2500);
        return () => clearTimeout(id);
      } else if (currentLevel === 4) {
        const id = setTimeout(() => {
          navigate("/results");
        }, 2500);
        return () => clearTimeout(id);
      }
    }
  }, [phase, currentLevel, navigate]);

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
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
            }}
            aria-live="polite"
          >
            Schritt 1
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(2),
            }}
            aria-live="polite"
          >
            {NEXT_LEVEL_TEXT[1]}
          </Typography>
        </>
      ) : currentLevel === 2 ? (
        <>
          {/* Desktop / Tablet one row*/}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              display: phase === "won" ? { xs: "none", sm: "block" } : "none",
              fontFamily: theme.typography.h6.fontFamily,
              textAlign: "center",
            }}
            aria-live="polite"
          >
            Schritt 1 geschafft!
          </Typography>

          {/* Mobile: two rows*/}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              display: phase === "won" ? { xs: "block", sm: "none" } : "none",
              fontFamily: theme.typography.h6.fontFamily,
              textAlign: "center",
            }}
            aria-live="polite"
          >
            Schritt 1<br />
            geschafft!
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
              display: phase === "next" ? "block" : "none",
              fontWeight: "bold",
              fontFamily: theme.typography.h6.fontFamily,
            }}
            aria-live="polite"
          >
            Schritt 2
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(2),
              display: phase === "next" ? "block" : "none",
              fontWeight: "normal",
            }}
            aria-live="polite"
          >
            {NEXT_LEVEL_TEXT[2]}
          </Typography>
        </>
      ) : currentLevel === 3 ? (
        <>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              display: phase === "won" ? "block" : "none",
              fontFamily: theme.typography.h6.fontFamily,
              textAlign: "center",
            }}
            aria-live="polite"
          >
            Schritt 2 <br /> geschafft!
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
              display: phase === "next" ? "block" : "none",
            }}
            aria-live="polite"
          >
            Schritt 3
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(2),
              display: phase === "next" ? "block" : "none",
              fontWeight: "normal",
            }}
            aria-live="polite"
          >
            {NEXT_LEVEL_TEXT[3]}
          </Typography>
        </>
      ) : currentLevel === 4 ? (
        <>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              marginBottom: theme.spacing(0.5),
              marginTop: theme.spacing(10),
              fontWeight: "bold",
              textAlign: "center",
            }}
            aria-live="polite"
          >
            Schritt 3 <br /> geschafft!
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(2),
              fontWeight: "normal",
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
