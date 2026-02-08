/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  styled,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../buttons/PrimaryButton";

/**
 * LoginReminderDialog displays a reminder dialog prompting users to login.
 * Used for features requiring authentication (e.g., saving favorites, preserving quiz results).
 */

// Shared message for favorites feature requiring login
export const FAVORITES_LOGIN_MESSAGE = (
  <>
    Du musst dich erst <strong>einloggen</strong>, um deine Favoriten speichern
    zu können.
  </>
);

// Shared message for navigation from results without login
export const RESULTS_NAVIGATION_MESSAGE = (
  <>
    Beachte: <br />
    <strong>Du bist nicht eingeloggt.</strong>
    <br />
    Deine Ergebnisse können nicht gespeichert werden.
    <br />
    Wenn du deine Ergebnisse auch später noch sehen willst, logge dich jetzt
    ein.
  </>
);

interface LoginReminderDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onProceedNavigation?: () => void;
  message?: React.ReactNode;
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 18,
    padding: theme.spacing(2),
    minWidth: 280,
    maxWidth: 400,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1.5),
    },
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0,0,0,0.25)",
  },
}));

const Title = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 700,
  textAlign: "center",
  fontSize: "1.2rem",
  paddingBottom: theme.spacing(1),
  paddingRight: theme.spacing(5),
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem",
    paddingBottom: theme.spacing(0.5),
  },
}));

const ContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: "center",
  fontSize: "20px",
  fontFamily: "Fira Sans, sans-serif",
  fontWeight: "normal",
  lineHeight: 1.5,
  whiteSpace: "pre-line",
  [theme.breakpoints.down("sm")]: {
    fontSize: "16px",
    lineHeight: 1.4,
  },
}));

const Actions = styled(DialogActions)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2),
  paddingTop: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
}));

const OptionBox = styled(Box)(({ theme }) => ({
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  userSelect: "none",
  transition: "0.2s ease",
  textAlign: "center",
  flex: 1,
  margin: "0 6px",

  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + "22",
  },

  "&:active": {
    transform: "scale(0.97)",
  },
}));

const CloseButtonWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

export default function LoginReminderDialog({
  open,
  onClose,
  onLoginClick,
  onProceedNavigation,
  message = RESULTS_NAVIGATION_MESSAGE,
}: LoginReminderDialogProps) {
  const handleLoginClick = () => {
    onClose();
    onLoginClick();
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <CloseButtonWrapper>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </CloseButtonWrapper>

      <Title>
        <span style={{ visibility: "hidden" }}>Placeholder</span>
      </Title>

      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <ContentText>{message}</ContentText>
      </DialogContent>

      <Actions
        sx={{
          flexDirection: onProceedNavigation ? "row" : "column",
          justifyContent: onProceedNavigation ? "space-between" : "center",
        }}
      >
        {onProceedNavigation && (
          <OptionBox onClick={onProceedNavigation} sx={{ flex: "0 0 auto" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: "normal",
                lineHeight: 1.2,
              }}
            >
              Seite trotzdem
              <br />
              verlassen
            </Typography>
          </OptionBox>
        )}

        <Box
          sx={{
            flex: "0 0 auto",
            margin: onProceedNavigation ? "0 6px" : "0 auto",
            maxWidth: onProceedNavigation ? "none" : "200px",
            marginLeft: onProceedNavigation ? "auto" : "auto",
          }}
        >
          <PrimaryButton
            label="Login"
            onClick={handleLoginClick}
            ariaText="Zur Login-Seite navigieren"
          />
        </Box>
      </Actions>
    </CustomDialog>
  );
}
