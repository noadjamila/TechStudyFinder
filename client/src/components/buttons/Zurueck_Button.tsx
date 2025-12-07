import { Button as MUIButton } from "@mui/material";
import { ButtonProps } from "../../types/Button.types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material";

export default function ZurueckButton({
  label = "Zurück Button",
  onClick,
  disabled = false,
  fullWidth = false,
  sx = {},
}: ButtonProps) {
  const theme = useTheme();
  return (
    <MUIButton
      variant="outlined"
      startIcon={<ArrowBackIcon data-testid="ArrowBackIcon" />}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        borderColor: theme.custom.secondaryBorder,
        color: theme.palette.text.secondary,
        textTransform: "none",
        fontFamily: "Roboto, sans-serif",
        borderRadius: "9px",
        padding: "2px 10px",
        fontSize: "0.9rem",
        fontWeight: 600,
        width: "auto",
        minWidth: "unset",
        ...sx,
      }}
    >
      {label}
    </MUIButton>
  );
}
