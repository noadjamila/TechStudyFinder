import { Typography, Box, Paper, Alert, alpha, Button } from "@mui/material";
import theme from "../../theme/theme";
import { useCallback, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SchoolIcon from "@mui/icons-material/School";
import BusinessIcon from "@mui/icons-material/Business";
import SendIcon from "@mui/icons-material/Send";
import WarningIcon from "@mui/icons-material/Warning";

import XmlUpload from "./XmlUploadField";
import StyledDialog from "../../components/dialogs/Dialog";

export default function UploadSection({
  onSubmit,
}: {
  onSubmit: (
    degreeprogrammeFile: File | null,
    institutionsFile: File | null,
  ) => void;
}) {
  const [degreeprogrammeFile, setDegreeprogrammeFile] = useState<File | null>(
    null,
  );
  const [institutionsFile, setInstitutionsFile] = useState<File | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleDegreeprogrammeFile = useCallback((file: File) => {
    setDegreeprogrammeFile(file);
  }, []);

  const handleInstitutionsFile = useCallback((file: File) => {
    setInstitutionsFile(file);
  }, []);

  const handleSubmit = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    console.log("Absenden:", {
      degreeprogramme: degreeprogrammeFile?.name,
      institutions: institutionsFile?.name,
    });
    setConfirmDialogOpen(false);
    onSubmit(degreeprogrammeFile, institutionsFile);
  };

  const hasFilesToSubmit = degreeprogrammeFile && institutionsFile;

  return (
    <div>
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.subHeader,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Laden Sie die XML-Dateien für Studiengänge und Hochschulen hoch, um
            die Datenbank zu aktualisieren.
          </Typography>
        </Box>

        {/* Info Alert */}
        <Alert
          icon={<InfoOutlinedIcon />}
          severity="info"
          sx={{
            mb: 4,
            backgroundColor: alpha(theme.palette.decorative.blue, 0.1),
            border: `1px solid ${theme.palette.decorative.blue}`,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              color: theme.palette.decorative.blueDark,
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
            Wichtige Hinweise:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { mb: 0.5 } }}>
            <li>
              Studiengänge: <strong>degreeprogramme.xml</strong>
            </li>
            <li>
              Hochschulen: <strong>institutions.xml</strong>
            </li>
            <li>Bestehende Einträge werden überschrieben</li>
          </Box>
        </Alert>

        {/* Upload Cards Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Studiengänge Upload */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.decorative.green, 0.3),
                border: `2px solid ${alpha(theme.palette.decorative.green, 0.5)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.decorative.greenDark,
                  backgroundColor: alpha(theme.palette.decorative.green, 0.4),
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <SchoolIcon
                  sx={{
                    fontSize: 32,
                    color: theme.palette.decorative.greenDark,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Studiengänge
                </Typography>
              </Box>
              <XmlUpload
                filename="degreeprogramme.xml"
                onUploaded={handleDegreeprogrammeFile}
                onRemoved={() => setDegreeprogrammeFile(null)}
              />
            </Paper>
          </Box>

          {/* Hochschulen Upload */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.decorative.blue, 0.3),
                border: `2px solid ${alpha(theme.palette.decorative.blue, 0.5)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: theme.palette.decorative.blueDark,
                  backgroundColor: alpha(theme.palette.decorative.blue, 0.4),
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <BusinessIcon
                  sx={{
                    fontSize: 32,
                    color: theme.palette.decorative.blueDark,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Hochschulen
                </Typography>
              </Box>
              <XmlUpload
                filename="institutions.xml"
                onUploaded={handleInstitutionsFile}
                onRemoved={() => setInstitutionsFile(null)}
              />
            </Paper>
          </Box>
        </Box>

        {/* Submit Button */}
        {hasFilesToSubmit && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              startIcon={<SendIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                "&:hover": {
                  backgroundColor: theme.palette.decorative.blueDark,
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Datenbank aktualisieren
            </Button>
          </Box>
        )}

        {/* Confirmation Dialog */}
        <StyledDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          title="Datenbank aktualisieren?"
          text={
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  mb: 2,
                  p: 2,
                  backgroundColor: alpha(
                    theme.palette.warning?.main || "#ff9800",
                    0.1,
                  ),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.warning?.main || "#ff9800", 0.3)}`,
                }}
              >
                <WarningIcon
                  sx={{
                    color: theme.palette.warning?.main || "#ff9800",
                    mt: 0.5,
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Achtung: Diese Aktion überschreibt bestehende Daten!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.subHeader,
                      lineHeight: 1.6,
                    }}
                  >
                    Alle bestehenden Einträge werden durch die neuen Daten
                    ersetzt. Diese Aktion kann nicht rückgängig gemacht werden.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 1,
                  }}
                >
                  Hochgeladene Dateien:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { mb: 0.5 } }}>
                  {degreeprogrammeFile && (
                    <li>
                      <strong>Studiengänge:</strong> {degreeprogrammeFile.name}
                    </li>
                  )}
                  {institutionsFile && (
                    <li>
                      <strong>Hochschulen:</strong> {institutionsFile.name}
                    </li>
                  )}
                </Box>
              </Box>
            </Box>
          }
          onCancel={() => setConfirmDialogOpen(false)}
          onConfirm={handleConfirmSubmit}
          cancelLabel="Abbrechen"
          confirmLabel="Ja, aktualisieren"
        />
      </Box>
    </div>
  );
}
