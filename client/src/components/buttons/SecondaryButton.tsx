/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Button, ButtonProps } from "@mui/material";
import theme from "../../theme/theme";

/**
 * Props for the SecondaryButton component.
 * Extends Material UI's ButtonProps with additional properties.
 */
export interface SecondaryButtonProps extends ButtonProps {
  label: string;
  ariaText?: string;
}

/**
 * A styled secondary button component using Material UI.
 * @param label: Button text.
 * @param action: Click handler function.
 * @param ariaText: Optional aria-label for accessibility.
 * @constructor
 */
export default function SecondaryButton({
  label,
  onClick: action,
  ariaText,
}: SecondaryButtonProps) {
  return (
    <Button
      aria-label={ariaText}
      variant="outlined"
      onClick={action}
      sx={{
        borderColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        "&:hover": {
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      {label}
    </Button>
  );
}
