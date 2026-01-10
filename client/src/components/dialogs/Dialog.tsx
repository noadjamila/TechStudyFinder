import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  styled,
  DialogProps,
  Typography,
  Box,
  Alert,
} from "@mui/material";

interface StyledDialogProps extends DialogProps {
  title: string;
  text: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  error?: string | null;
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
  textAlign: "left",
  fontSize: "1.2rem",
  paddingBottom: theme.spacing(1),
}));

const ContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: "left",
}));

const Actions = styled(DialogActions)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  paddingInline: theme.spacing(1),
  marginTop: theme.spacing(1),
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

export default function StyledDialog({
  open,
  onClose,
  title,
  text,
  onCancel,
  onConfirm,
  cancelLabel = "Abbrechen",
  confirmLabel = "OK",
  error,
  ...props
}: StyledDialogProps) {
  return (
    <CustomDialog open={open} onClose={onClose} {...props}>
      <Title>{title}</Title>

      <DialogContent sx={{ textAlign: "center" }}>
        <ContentText>{text}</ContentText>
      </DialogContent>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Actions>
        <OptionBox onClick={onCancel ?? (() => onClose?.({}, "backdropClick"))}>
          <Typography>{cancelLabel}</Typography>
        </OptionBox>

        <OptionBox onClick={onConfirm}>
          <Typography>{confirmLabel}</Typography>
        </OptionBox>
      </Actions>
    </CustomDialog>
  );
}
