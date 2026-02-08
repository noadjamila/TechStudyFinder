/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Typography, Box, alpha, Alert } from "@mui/material";
import theme from "../../theme/theme";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Layout from "../../layouts/AdminLayout";
import UploadSection from "../../components/admin/UploadSection";
import Spinner from "../../components/admin/Spinner";
import { useNavigate } from "react-router-dom";

/**
 * Admin Upload Page.
 * Page for admins to upload XML files to update the database.
 * @returns JSX Element
 */
export default function AdminUpload() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    degreeprogrammeFile: File | null,
    institutionsFile: File | null,
  ) => {
    setIsProcessing(true);
    setIsSuccess(false);
    setError(null);

    if (!degreeprogrammeFile || !institutionsFile) {
      setError("Bitte beide XML-Dateien hochladen.");
      setIsProcessing(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("degreeprogrammes", degreeprogrammeFile);
      formData.append("institutions", institutionsFile);

      const res = await fetch("/api/admin/upload-data", {
        method: "POST",
        body: formData,
      });

      // Prüfen ob Response JSON enthält
      const contentType = res.headers.get("content-type");
      let data: any = {};

      if (contentType && contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch (parseError) {
          console.error("Fehler beim Parsen der JSON-Response:", parseError);
        }
      }

      if (!res.ok) {
        // Backend-Fehlermeldung anzeigen, falls vorhanden
        const errorMessage =
          data?.error || data?.details || `HTTP-Fehler! Status: ${res.status}`;
        throw new Error(errorMessage);
      }

      setIsSuccess(true);
      setError(null);
      setTimeout(() => {
        setIsSuccess(false);
        navigate("/admin/edit");
      }, 2000);
    } catch (err) {
      console.error("Error during API call:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Fehler beim Verbinden mit dem Backend oder Verarbeiten der Daten.";
      setError(errorMessage);
      setIsSuccess(false);
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
            onClose={() => setError(null)}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Fehler beim Hochladen
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}

        {isSuccess && (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{
              mt: 4,
              mb: 4,
              backgroundColor: alpha(theme.palette.decorative.green, 0.2),
              border: `2px solid ${theme.palette.decorative.green}`,
              "& .MuiAlert-icon": {
                color: theme.palette.decorative.greenDark,
              },
            }}
            onClose={() => setIsSuccess(false)}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Datenbank erfolgreich aktualisiert!
            </Typography>
            <Typography variant="body2">
              Die hochgeladenen XML-Dateien wurden erfolgreich verarbeitet und
              die Datenbank wurde aktualisiert.
            </Typography>
          </Alert>
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

        {!isProcessing && <UploadSection onSubmit={handleSubmit} />}
      </Box>
    </Layout>
  );
}
