import { Button as MUIButton } from "@mui/material";
import { ButtonProps } from "../../types/Button.types";

export default function Button({
  label = "Button",
  onClick,
  disabled = false,
  fullWidth = false,
  color = "primary",
  sx = {},
}: ButtonProps) {
  return (
    <MUIButton
      variant="contained"
      color={color}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        borderRadius: "20px",
        textTransform: "none",
        boxShadow: 3,
        ...sx,
      }}
    >
      {label}
    </MUIButton>
  );
}
