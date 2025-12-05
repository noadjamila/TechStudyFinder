import { Button as MUIButton } from "@mui/material";
import { ButtonProps } from "../../types/Button.types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ZurueckButton({
  label = "Zurück Button",
  onClick,
  disabled = false,
  fullWidth = false,
  sx = {},
}: ButtonProps) {
  return (
    <MUIButton
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        borderColor: "black",
        color: "black",
        textTransform: "none",
        fontFamily: "Roboto, sans-serif",
        borderRadius: "15px",
        padding: "3px 10px",
        fontSize: "1rem",
        width: "auto",
        minWidth: "unset",
        ...sx,
      }}
    >
      {label}
    </MUIButton>
  );
}
