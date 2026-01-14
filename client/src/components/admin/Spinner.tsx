import { Paper, Typography, CircularProgress, alpha } from "@mui/material";
import theme from "../../theme/theme";

interface LoadingIndicatorProps {
  text?: string;
}

const Spinner = ({ text = "Lädt…" }: LoadingIndicatorProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
          mb: 2,
        }}
      />

      <Typography variant="body1" color="text.secondary">
        {text}
      </Typography>
    </Paper>
  );
};

export default Spinner;
