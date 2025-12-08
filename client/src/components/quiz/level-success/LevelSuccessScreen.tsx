import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Level = 1 | 2 | 3;

export type LevelSuccessScreenProps = {
  /* The level the user has just completed (1, 2 or 3)*/
  currentLevel: Level;
  /* callback */
  onContinue?: () => void;
};
/*Short descriptions for what happens in the next level*/
const NEXT_LEVEL_TEXT: Record<Level, string> = {
  1: "Interessenbasierte Orientierung (RISEC)",
  2: "Vertiefende Fachinteressen / Spezialisierung",
  3: "Du hast alle Level abgeschlossen",
};

export default function LevelSuccessScreen({
  currentLevel,
  onContinue = () => {},
}: LevelSuccessScreenProps) {
  /*Component phase:
   * "won" then show “Level X completed!”
   * "next" then show “Next Level: …”
   */
  const [phase, setPhase] = useState<"won" | "next">("won");
  const theme = useTheme();

  useEffect(() => {
    // After 1.2 seconds, switch to next-level text
    const id = setTimeout(() => setPhase("next"), 1200);
    return () => clearTimeout(id);
  }, [currentLevel]);

  const nextText =
    currentLevel === 3
      ? NEXT_LEVEL_TEXT[3]
      : NEXT_LEVEL_TEXT[(currentLevel + 1) as Level];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: theme.spacing(2),
      }}
    >
      <Box
        role="dialog"
        aria-labelledby="ls-title"
        sx={{
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "8px",
          padding: theme.spacing(4),
          boxShadow: 3,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography
          id="ls-title"
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            marginBottom: theme.spacing(2),
            display: phase === "won" ? "block" : "none",
            fontFamily: theme.typography.fontFamily,
          }}
          aria-live="polite"
        >
          Level {currentLevel} geschafft!
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
          {nextText}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={onContinue}
          sx={{
            marginTop: theme.spacing(3),
            padding: theme.spacing(1.5, 4),
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Weiter
        </Button>
      </Box>
    </Box>
  );
}
