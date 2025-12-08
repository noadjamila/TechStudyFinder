import { Button, Stack, useTheme } from "@mui/material";

interface QuizButtonsProps {
  startStudying: () => void;
  masterStudies: () => void;
  lookAround: () => void;
}

export default function QuizButtons_L1({
  startStudying,
  masterStudies,
  lookAround,
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
        variant="outlined"
        onClick={startStudying}
        sx={{
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Ein Studium beginnen?
      </Button>

      <Button
        variant="outlined"
        onClick={masterStudies}
        sx={{
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Einen Master studieren?
      </Button>

      <Button
        variant="outlined"
        onClick={lookAround}
        sx={{
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
        }}
      >
        Dich erstmal umschauen?
      </Button>
    </Stack>
  );
}
