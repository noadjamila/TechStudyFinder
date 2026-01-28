import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import GreenCard from "../components/cards/GreenCardBaseNotQuiz";
import theme from "../theme/theme";
import MainLayout from "../layouts/MainLayout";
import PrimaryButton from "../components/buttons/PrimaryButton";
import { clearQuizResults } from "../session/persistQuizResults";

/**
 * Homescreen component.
 * Renders the landing page of the application, presenting key information
 * and offering a quiz start option. It adapts its layout based on whether
 * the screen size corresponds to a desktop or mobile view.
 *
 * @returns {React.FC} The rendered Homescreen component.
 */
const Homescreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  useEffect(() => {
    clearQuizResults().catch(console.error);
  }, []);
  // Check for logout confirmation flag whenever the component mounts or location changes
  useEffect(() => {
    const confirmationFlag = sessionStorage.getItem("showLogoutConfirmation");
    if (confirmationFlag) {
      setShowLogoutMessage(true);
      sessionStorage.removeItem("showLogoutConfirmation");
    }
  }, [location]);

  /**
   * Handles the start of the quiz by navigating to the level success screen first.
   */
  const handleQuizStart = () => {
    navigate("/quiz");
  };

  // --- Static Content Definitions ---
  const mainTitle = "Finde dein Studium";
  const subTitle = "Du weißt nicht, was du studieren möchtest?";
  const infoText1 = "Kein Problem!";
  const infoText2 =
    "Tech Study Finder unterstützt dich dabei, Studiengänge zu finden, die zu deinen persönlichen Interessen passen.";
  const cardQuestion = "Bist du bereit, dich auf die Reise zu begeben?";
  // ----------------------------------

  // Wrapper for all main content (used in both mobile and desktop)
  const MainContent = (
    <Box
      className="page-content-wrapper"
      sx={{
        overflow: "visible",
        maxWidth: "100%",
        mx: "auto",
        mt: { xs: 1, sm: 15, md: 9 },
        position: "relative",
        color: theme.palette.text.primary,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Main Title */}
      <Typography variant="h2">{mainTitle}</Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{ fontWeight: "normal", lineHeight: 1.3, mb: 0 }}
      >
        {subTitle}
      </Typography>

      {/* Info Texts */}
      <Box sx={{ maxWidth: 500, mx: "auto", mb: { xs: 10, sm: 8, md: 2 } }}>
        <Typography
          variant="body1"
          sx={{
            mt: 3,
            px: { xs: 2, sm: 0 },
            pt: { xs: 0 },
            mb: { xs: 1, md: 3 },
            fontWeight: "bold",
          }}
        >
          {infoText1}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.3,
            mb: { xs: 1, md: 10 },
          }}
        >
          {infoText2}
        </Typography>
      </Box>

      {/* Card */}
      <GreenCard>
        <Typography variant="subtitle1" sx={{ mb: 3, lineHeight: 1.3 }}>
          {cardQuestion}
        </Typography>

        <PrimaryButton
          label={"Quiz beginnen"}
          onClick={handleQuizStart}
          ariaText="Quiz beginnen"
        />
      </GreenCard>

      <Snackbar
        open={showLogoutMessage}
        autoHideDuration={800}
        onClose={() => setShowLogoutMessage(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Du wurdest ausgeloggt.
        </Alert>
      </Snackbar>
    </Box>
  );

  return <MainLayout>{MainContent}</MainLayout>;
};

export default Homescreen;
