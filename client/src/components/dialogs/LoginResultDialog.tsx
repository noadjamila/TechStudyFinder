/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";

interface LoginResultDialogProps {
  open: boolean;
  success: boolean;
  onClose: () => void;
  autoCloseDuration?: number;
}

/**
 * LoginResultDialog component.
 * Displays success or error message after login attempt in a simple Snackbar.
 * Success: "Login erfolgreich" - Auto-closes and navigates to /home
 * Error: "Username oder Passwort falsch - Bitte versuche es erneut" - stays on login
 *
 * @param {LoginResultDialogProps} props - Component props
 * @returns {React.ReactElement} Snackbar component
 */
export default function LoginResultDialog({
  open,
  success,
  onClose,
  autoCloseDuration = 800,
}: LoginResultDialogProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoCloseDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={success ? "success" : "error"} sx={{ width: "100%" }}>
        {success
          ? "Login erfolgreich"
          : "Username oder Passwort falsch - Bitte versuche es erneut"}
      </Alert>
    </Snackbar>
  );
}
