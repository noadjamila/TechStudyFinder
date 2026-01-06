import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CardStack from "../../../src/components/quiz/CardStack";
import theme from "../../theme/theme";
import MainLayout from "../../layouts/MainLayout";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import Headline from "../../components/Headline";

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
        mt: { xs: 4, sm: 15, md: 9 },
        position: "relative",
        color: theme.palette.text.primary,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Main Title */}
      <Headline label={mainTitle} />

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{ fontWeight: "normal", lineHeight: 1.3, mb: 3 }}
      >
        {subTitle}
      </Typography>

      {/* Info Texts */}
      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Typography
          variant="body1"
          sx={{
            mt: 3,
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
            mb: { xs: 2, md: 10 },
          }}
        >
          {infoText2}
        </Typography>
      </Box>

      {/* Card */}
      <CardStack currentIndex={1} totalCards={1}>
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: 360, sm: 520, md: 900 },
            px: { xs: 2, md: 8 },
            py: { xs: 4, md: 5 },
            mt: { xs: 8, md: 0 },
            mx: "auto",

            backgroundColor: theme.palette.decorative.green,
            borderRadius: 4,
            boxShadow: 3,

            position: "relative",
            textAlign: "center",
          }}
        >
          {/* Mascot (NOT centered intentionally) */}
          <Box
            component="img"
            src="/mascot_standing_blue.svg"
            alt="Maskottchen"
            sx={{
              position: "absolute",
              width: 40,
              top: -60,
              right: { xs: 40, md: 20 },
            }}
          />

          <Typography variant="subtitle1" sx={{ mb: 3, lineHeight: 1.3 }}>
            {cardQuestion}
          </Typography>

          <PrimaryButton
            label={"Quiz beginnen"}
            onClick={handleQuizStart}
            ariaText="Quiz beginnen"
          />
        </Box>
      </CardStack>
    </Box>
  );

  return <MainLayout>{MainContent}</MainLayout>;
};

export default Homescreen;
