import { Button as MUIButton } from "@mui/material";
import { ButtonProps } from "../../types/Button.types";

export default function Button({
  label = "Button",
  onClick,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <MUIButton
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        backgroundColor: "lightGrey",
        color: "darkGrey",
        borderRadius: "20px",
        boxShadow: 3,
        ":hover": {
          backgroundColor: "purple",
        },
      }}
    >
      {label}
    </MUIButton>
  );
}
