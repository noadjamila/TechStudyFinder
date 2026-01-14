import { Typography, Box, Paper, alpha } from "@mui/material";
import theme from "../../theme/theme";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import Layout from "../../layouts/AdminLayout";
import UploadSection from "../../components/admin/UploadSection";
import Spinner from "../../components/admin/Spinner";

export default function AdminUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = (
    __degreeprogrammeFile: File | null,
    __institutionsFile: File | null,
  ) => {
    setIsUploading(true);
    // API call

    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
    }, 3000);
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

        {isUploading ? (
          <Box
            sx={{
              mt: 6,
            }}
          >
            <Spinner text="Datenbank wird aktualisiert..." />
          </Box>
        ) : (
          <UploadSection onSubmit={handleSubmit} />
        )}
      </Box>
    </Layout>
  );
}
