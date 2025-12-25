import React from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import StartButton from "../../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import CardStack from "../../components/cards/CardStackLevel2";
import theme from "../../theme/theme";
import LogoMenu from "../../components/logo-menu/LogoMenu";
import Navigationbar from "../../components/nav-bar/NavBar";
import DesktopLayout from "../../layouts/DesktopLayout";
import GreenCard from "../../components/cards/GreenCardBaseNotQuiz";

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
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));

  /**
   * Handles the start of the quiz by navigating to the level success screen first.
   */
  const handleQuizStart = () => {
    navigate("/level-success/1");
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
        px: { xs: 1, sm: 0 },
        textAlign: "center",
        mt: { xs: 4, sm: 15, md: 9 },
        position: "relative",
        color: theme.palette.text.primary,
      }}
    >
      {/* Main Title */}
      <Typography
        variant="h2"
        className="title"
        sx={{
          mt: { md: 3 },
        }}
      >
        {mainTitle}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        className="subtitle"
        sx={{ fontWeight: "normal", lineHeight: 1.3, mb: 3 }}
      >
        {subTitle}
      </Typography>

      {/* box for the info texts (Container for explanatory paragraphs) */}
      <Box
        className="info-text"
        sx={{
          mx: "auto",
        }}
      >
        {/*text: Kein problem*/}
        <Typography
          variant="body1"
          sx={{
            px: { xs: 2, sm: 0 },
            pt: { xs: 1 },
            mb: { xs: 1, md: 3 },
            mt: 3,
            fontWeight: "bold",
            transform: { md: "translateX(0%)" },
          }}
        >
          {infoText1}
        </Typography>

        {/*text: techstudyfinder hilft dir dabei*/}
        <Typography
          variant="body1"
          sx={{
            px: { xs: 2, sm: 0 },
            lineHeight: 1.3,
            maxWidth: { xs: "100%", sm: 400 },
            transform: { md: "translateX(7.5%)" },
            mb: { xs: 0, md: 10 },
          }}
        >
          {infoText2}
        </Typography>
      </Box>

      {/* card box (The green card) */}
      <Box sx={{ mt: { xs: "65px", md: "40px" } }}>
        <CardStack currentIndex={1} totalCards={1}>
          <GreenCard>
            {/* Mascot Image (positioned absolutely relative to the card box) */}
            <Box
              component="img"
              src="/mascot_standing_blue.svg"
              alt="Maskottchen"
              sx={{
                position: "absolute",
                width: { xs: 40, sm: 40 },
                height: "auto",
                top: {
                  xs: -60,
                  sm: -58,
                },
                right: {
                  xs: 60,
                  sm: 50,
                  md: 20,
                },
              }}
            />

            {/* Card Question Text */}
            <Typography
              variant="subtitle1"
              sx={{
                mb: 3,
                lineHeight: 1.3,
              }}
            >
              {cardQuestion}
            </Typography>

            {/* Start Quiz Button */}
            <StartButton
              label="Quiz beginnen"
              onClick={handleQuizStart}
              sx={{
                borderRadius: 3,
                padding: "8px 16x",
                fontSize: "1.0rem",
                width: "fit-content",
                mx: "auto",
                display: "block",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                fontWeight: "normal",
              }}
            />
          </GreenCard>
        </CardStack>
      </Box>
    </Box>
  );

  return (
    <div
      className="homescreen-container"
      style={{
        overflow: "hidden",
        height: "100svh",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Conditional Rendering based on viewport size */}
      {isDesktop ? (
        // DESKTOP VIEW: Content is placed inside the structured layout

        <DesktopLayout onMenuToggle={toggleSidebar}>
          {MainContent}
        </DesktopLayout>
      ) : (
        // MOBILE VIEW: Logo menu and navigation bar are rendered outside the main content flow
        <>
          <LogoMenu />
          <Navigationbar />
          {MainContent}
        </>
      )}
    </div>
  );
};

export default Homescreen;
