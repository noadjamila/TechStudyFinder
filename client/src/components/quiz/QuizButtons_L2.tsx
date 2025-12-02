import { Button, Stack, useTheme } from "@mui/material";

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
      direction={"row"}
      spacing={2}
      sx={{ mt: 3, justifyContent: "center" }}
    >
      <Button
        variant="outlined"
        onClick={onNo}
        sx={{
          borderColor: theme.custom.secondaryBorder,
          color: theme.palette.text.primary,
        }}
      >
        Nein
      </Button>

      <Button
        variant="outlined"
        onClick={onYes}
        sx={{
          bgcolor: theme.custom.primaryButton,
          color: theme.palette.text.primary,
        }}
      >
        Ja
      </Button>

      <Button
        variant="outlined"
        onClick={onSkip}
        sx={{
          borderColor: theme.custom.tertiaryBorder,
          color: theme.palette.text.primary,
        }}
      >
        Überspringen
      </Button>
    </Stack>
  );
}
