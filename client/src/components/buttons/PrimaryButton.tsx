/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Button, ButtonProps } from "@mui/material";
import theme from "../../theme/theme";

/**
 * Props for the PrimaryButton component.
 * Extends Material UI's ButtonProps with additional properties.
 */
export interface PrimaryButtonProps extends ButtonProps {
  label: string;
  ariaText?: string;
}

/**
 * A styled primary button component using Material UI.
 * @param label: Button text.
 * @param action: Click handler function.
 * @param ariaText: Optional aria-label for accessibility.
 * @constructor
 */
export default function PrimaryButton({
  label,
  onClick: action,
  ariaText,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  return (
    <Button
      aria-label={ariaText}
      variant="contained"
      onClick={action}
      disabled={disabled}
      sx={{
        bgcolor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        borderRadius: "9px",
        fontWeight: "normal",
        "&:hover:not(:disabled)": {
          bgcolor: theme.palette.decorative.blueDark,
        },
        "&:disabled": {
          bgcolor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          color: theme.palette.text.primary,
          opacity: 0.5,
          cursor: "not-allowed",
        },
      }}
      {...rest}
    >
      {label}
    </Button>
  );
}
