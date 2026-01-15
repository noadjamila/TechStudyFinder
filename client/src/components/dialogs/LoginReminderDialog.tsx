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

interface LoginReminderDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onProceedNavigation?: () => void;
  message: React.ReactNode;
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
  message,
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

      <Actions>
        <OptionBox onClick={onProceedNavigation}>
          <Typography>Seite trotzdem verlassen</Typography>
        </OptionBox>

        <OptionBox>
          <PrimaryButton
            label="Login"
            onClick={handleLoginClick}
            ariaText="Zur Login-Seite navigieren"
          />
        </OptionBox>
      </Actions>
    </CustomDialog>
  );
}
