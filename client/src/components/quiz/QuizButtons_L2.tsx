import { Box, Button, Stack, useTheme } from "@mui/material";

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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "16px",
          width: "100%",
        }}
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
            borderColor: theme.custom.primaryButton,
            color: theme.palette.text.primary,
          }}
        >
          Ja
        </Button>
      </Box>

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
