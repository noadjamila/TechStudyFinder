import { SxProps, Theme } from "@mui/material/styles";

export interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
}
