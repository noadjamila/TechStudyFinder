import { Button } from "@mui/material";
import { ButtonProps } from "../../types/Button.types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material";

export default function ZurueckButton({
  label = "Zurück Button",
  onClick,
  disabled = false,
  fullWidth = false,
  //sx = {},
}: ButtonProps) {
  const theme = useTheme();
  return (
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon data-testid="ArrowBackIcon" />}
      onClick={onClick}
      size="small"
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        borderColor:
          theme.palette.quiz?.secondary ?? theme.palette.text.secondary,
        color: theme.palette.text.secondary,
        textTransform: "none",
        fontFamily: "Roboto, sans-serif",
        borderRadius: "9px",

        minHeight: 28,
        height: "35px",
        padding: "0px 10px",
        fontSize: "0.80rem",

        "& .MuiButton-startIcon": {
          marginRight: 1,
          "& .MuiSvgIcon-root": {
            fontSize: 16,
          },
        },

        mb: 7,
        // ...sx,
        //...sx,
      }}
    >
      {label}
    </Button>
  );
}
