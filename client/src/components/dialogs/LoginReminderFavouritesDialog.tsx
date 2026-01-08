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

interface LoginReminderDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 18,
    padding: theme.spacing(2),
    minWidth: 280,
    backgroundColor: theme.palette.background.default,
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
}));

const ContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: "center",
  fontSize: "20px",
  fontFamily: "Fira Sans, sans-serif",
  fontWeight: "normal",
  lineHeight: 1.5,
}));

const Actions = styled(DialogActions)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(2),
  paddingTop: theme.spacing(3),
}));

const CloseButtonWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

/**
 * LoginReminderDialog component.
 * Displays a dialog prompting users to login when trying to save favorites.
 * Features a close button in top right and a primary login button.
 *
 * @param {LoginReminderDialogProps} props - Component props
 * @returns {React.ReactElement} Dialog component
 */
export default function LoginReminderDialog({
  open,
  onClose,
  onLoginClick,
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
        <ContentText>
          Du musst dich erst einloggen, um deine Favoriten speichern zu können.
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
