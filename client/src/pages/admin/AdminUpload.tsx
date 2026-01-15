import { Typography, Box, Paper, alpha, Alert } from "@mui/material";
import theme from "../../theme/theme";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Layout from "../../layouts/AdminLayout";
import UploadSection from "../../components/admin/UploadSection";
import Spinner from "../../components/admin/Spinner";

export default function AdminUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    degreeprogrammeFile: File | null,
    institutionsFile: File | null,
  ) => {
    setIsProcessing(true);

    try {
      const res = await fetch("/api/admin/upload-dat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          degreeprogrammeFile: degreeprogrammeFile,
          institutionsFile: institutionsFile,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Error during API call:", err);
      setError(
        "Fehler beim Verbinden mit dem Backend oder Verarbeiten der Daten.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              color: theme.palette.text.primary,
            }}
          >
            Daten aktualisieren
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
            }}
          >
            {error}
          </Alert>
        )}

        {isSuccess && (
          <Box
            sx={{
              mt: 4,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.decorative.green, 0.3),
                border: `2px solid ${theme.palette.decorative.green}`,
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 36,
                  color: theme.palette.decorative.greenDark,
                }}
              />
              <Typography variant="body1" color="text.secondary">
                Daten erfolgreich aktualisiert!
              </Typography>
            </Paper>
          </Box>
        )}

        {isProcessing && (
          <Box
            sx={{
              mt: 6,
            }}
          >
            <Spinner text="Datenbank wird aktualisiert..." />
          </Box>
        )}

        {!isProcessing && !isSuccess && (
          <UploadSection onSubmit={handleSubmit} />
        )}
      </Box>
    </Layout>
  );
}
