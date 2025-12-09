import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Level = 1 | 2 | 3 | 4;

export type LevelSuccessScreenProps = {
  /* The level the user has just completed (1, 2 or 3)*/
  currentLevel: Level;
  /* callback */
  onContinue?: () => void;
};
/*Short descriptions for what happens in the next level*/
const NEXT_LEVEL_TEXT: Record<Level, string> = {
  1: "Deine Rahmenbedingungen",
  2: "Deine Interessen",
  3: "Dein Arbeitsstil",
  4: "Verfeinerung",
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
    if (currentLevel === 1) {
      setPhase("next");
    } else {
      const id = setTimeout(() => setPhase("next"), 1200);
      return () => clearTimeout(id);
    }
  }, [currentLevel]);

  const nextText =
    currentLevel === 3
      ? NEXT_LEVEL_TEXT[4]
      : NEXT_LEVEL_TEXT[(currentLevel + 1) as Level];

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
              marginBottom: theme.spacing(2),
              fontFamily: theme.typography.fontFamily,
            }}
            aria-live="polite"
          >
            Level {currentLevel}
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
            {NEXT_LEVEL_TEXT[1]}
          </Typography>
        </>
      ) : (
        <>
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
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              marginTop: theme.spacing(4),
              display: phase === "next" ? "block" : "none",
              fontFamily: theme.typography.h5.fontFamily,
            }}
            aria-live="polite"
          >
            Level {currentLevel + 1}
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
        </>
      )}

      <Box
        sx={{
          position: "absolute",
          bottom: theme.spacing(3),
          right: theme.spacing(2),
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onContinue}
          sx={{
            padding: theme.spacing(1.5, 4),
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            display: phase === "next" ? "block" : "none",
          }}
        >
          Weiter
        </Button>
      </Box>
    </Box>
  );
}
