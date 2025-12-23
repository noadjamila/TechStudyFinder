import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

type Level = 1 | 2 | 3 | 4;
type Phase = "won" | "next";

export type LevelSuccessScreenProps = {
  currentLevel: Level;
  onContinue?: () => void;
};
type LevelConfig = {
  wonTitle?: string;
  nextTitle?: string;
  nextText?: string;
};

const NEXT_LEVEL_TEXT: Record<Level, string> = {
  1: "Deine Rahmenbedingungen",
  2: "Deine Interessen",
  3: "Du hast alle Schritte abgeschlossen",
  4: "",
};

const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  1: { nextTitle: "Schritt 1", nextText: NEXT_LEVEL_TEXT[1] },
  2: {
    wonTitle: "Schritt 1 geschafft!",
    nextTitle: "Schritt 2",
    nextText: NEXT_LEVEL_TEXT[2],
  },
  3: {
    wonTitle: "Schritt 2 geschafft!",
    nextTitle: "Deine Ergebnisse",
    nextText: NEXT_LEVEL_TEXT[3],
  },
  4: { wonTitle: "", nextText: NEXT_LEVEL_TEXT[4] },
};

const titleSx = {
  mt: 10,
  mb: 0.5,
  textAlign: "center",
  fontWeight: "bold",
};

const subtitleSx = {
  mt: 2,
  textAlign: "center",
};

export default function LevelSuccessScreen({
  currentLevel,
}: LevelSuccessScreenProps) {
  const [phase, setPhase] = useState<Phase>("won");
  const navigate = useNavigate();
  const location = useLocation();
  const config = LEVEL_CONFIG[currentLevel];

  useEffect(() => {
    //manage phase transitions based on current level
    if (currentLevel === 1) {
      setPhase("next");
      return;
    }
    const id = setTimeout(() => setPhase("next"), 1800);
    return () => clearTimeout(id);
  }, [currentLevel]);

  useEffect(() => {
    if (phase !== "next") return;

    //navigates the routes after showing the next phase
    const id = setTimeout(() => {
      if (currentLevel === 1) {
        navigate("/quiz/level/1");
      }

      if (currentLevel === 2) {
        navigate("/quiz/level/2");
      }

      if (currentLevel === 3) {
        navigate("/results", { state: location.state });
      }
    }, 1200);

    return () => clearTimeout(id);
  }, [phase, currentLevel, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100dvh",
        p: 2,
      }}
    >
      {phase === "won" && config.wonTitle && (
        <Typography variant="h6" sx={titleSx} aria-live="polite">
          {" "}
          {config.wonTitle}
        </Typography>
      )}

      {phase === "next" && (
        <>
          {config.nextTitle && (
            <Typography variant="h6" sx={titleSx} aria-live="polite">
              {" "}
              {config.nextTitle}
            </Typography>
          )}
          {config.nextText && (
            <Typography variant="subtitle1" sx={subtitleSx} aria-live="polite">
              {config.nextText}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
