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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrimaryButton from "../buttons/PrimaryButton";

/**
 * LoginReminderResultList displays a dialog warning users that quiz results will expire if not logged in.
 * Shows a login button to navigate to the login page and preserve results.
 */

interface LoginReminderResultListProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
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

const CloseButtonWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

export default function LoginReminderResultList({
  open,
  onClose,
  onLoginClick,
}: LoginReminderResultListProps) {
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
        <ContentText>
          Beachte: du bist nicht eingeloggt. Deine Ergebnisse können nach einer
          Zeit nicht mehr abgerufen werden.
        </ContentText>
      </DialogContent>

      <Actions>
        <PrimaryButton
          label="Login"
          onClick={handleLoginClick}
          ariaText="Zur Login-Seite navigieren"
        />
      </Actions>
    </CustomDialog>
  );
}
