import { Button as MUIButton } from "@mui/material";
import { ButtonProps } from "../../types/Button.types";

export default function ZurueckButton({
  label = "Zurück Button",
  onClick,
  disabled = false,
  fullWidth = false,
  color = "secondary",
  sx = {},
}: ButtonProps) {
  return (
    <MUIButton
      variant="outlined"
      color={color}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        borderRadius: "20px",
        fontWeight: "bold",
        textTransform: "none",
        boxShadow: 3,
        ...sx,
      }}
    >
      {label}
    </MUIButton>
  );
}
