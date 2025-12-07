import { Button, Stack, Typography, useTheme } from "@mui/material";

interface QuizButtonsProps {
  onYes: () => void;
  onNo: () => void;
  onSkip: () => void;
}

export default function QuizButtons_L2({
  onYes,
  onNo,
  onSkip,
}: QuizButtonsProps) {
  const theme = useTheme();
  return (
    <Stack
      spacing={2}
      sx={{
        mt: 3,
        justifyContent: "center",
        padding: "0 2em",
      }}
    >
      <Button
        aria-label="Antwort Ja"
        variant="outlined"
        onClick={onYes}
        sx={{
          bgcolor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Ja
      </Button>

      <Button
        aria-label="Antwort Nein"
        variant="outlined"
        onClick={onNo}
        sx={{
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Nein
      </Button>

      <Typography
        aria-label="Antwort Überspringen"
        onClick={onSkip}
        sx={{
          cursor: "pointer",
          color: theme.palette.text.skipButton,
          textAlign: "center",
          textDecoration: "underline",
        }}
      >
        Überspringen
      </Typography>
    </Stack>
  );
}
