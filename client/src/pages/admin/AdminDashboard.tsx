import { Box, Typography } from "@mui/material";
import theme from "../../theme/theme";
import UploadIcon from "@mui/icons-material/Upload";
import SettingsIcon from "@mui/icons-material/Settings";
import SourceIcon from "@mui/icons-material/Source";
import Layout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

const cardBaseSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  px: 4,
  py: { xs: 4, md: 5 },
  borderRadius: 4,
  boxShadow: 3,
  width: "100%",
  gap: 2,
  cursor: "pointer",
};

/**
 * Admin Dashboard Page.
 * Main dashboard for admin users with navigation options.
 * @returns JSX Element
 */
export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Typography variant="h2" align="center" mt={4}>
        Admin Dashboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 5,
        }}
      >
        <Typography variant="h5" align="center">
          Willkommen zum Admin-Bereich! Wählen Sie eine Option aus, um
          fortzufahren.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 5,
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          onClick={() => {
            navigate("/admin/upload");
          }}
          sx={{
            ...cardBaseSx,
            backgroundColor: theme.palette.decorative.green,
            "&:hover": {
              backgroundColor: theme.palette.decorative.greenDark,
            },
          }}
        >
          <UploadIcon fontSize="large" />
          <Typography
            variant="h5"
            align="center"
            sx={{ fontSize: { xs: 18, md: 20 } }}
          >
            Daten aktualiseren
          </Typography>
        </Box>

        <Box
          onClick={() => {
            navigate("/admin/edit");
          }}
          sx={{
            ...cardBaseSx,
            backgroundColor: theme.palette.decorative.blue,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <SettingsIcon fontSize="large" />
          <Typography
            variant="h5"
            align="center"
            sx={{ fontSize: { xs: 18, md: 20 } }}
          >
            Daten verwalten
          </Typography>
        </Box>
        <Box
          onClick={() => {
            navigate("/admin/instructions");
          }}
          sx={{
            ...cardBaseSx,
            backgroundColor: theme.palette.decorative.pink,
            "&:hover": {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        >
          <SourceIcon fontSize="large" />
          <Typography
            variant="h5"
            align="center"
            sx={{ fontSize: { xs: 18, md: 20 } }}
          >
            Anleitungen
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}
