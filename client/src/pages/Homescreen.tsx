import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import StartButton from "../../components/buttons/Button";
import { useNavigate, useLocation } from "react-router-dom";
import CardStack from "../../components/cards/CardStackLevel2";
import theme from "../../theme/theme";
import Header from "../../components/Header";
import DesktopLayout from "../../layouts/DesktopLayout";
import GreenCard from "../../components/cards/GreenCardBaseNotQuiz";
import { useAuth } from "../../contexts/AuthContext";

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
  const muiTheme = useTheme();
  const { logout } = useAuth();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check for logout confirmation flag whenever the component mounts or location changes
  useEffect(() => {
    const confirmationFlag = sessionStorage.getItem("showLogoutConfirmation");
    if (confirmationFlag) {
      setShowLogoutConfirmation(true);
      sessionStorage.removeItem("showLogoutConfirmation");
    }
  }, [location]);

  /**
   * Handles confirming the logout action
   */
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setShowLogoutConfirmation(false);

    try {
      await logout();
      setShowLogoutMessage(true);
      // Refresh auth status in NavBar by triggering a re-check
      window.dispatchEvent(new Event("auth-status-changed"));
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * Handles canceling the logout action
   */
  const handleCancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

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
        px: { xs: 1, sm: 0 },
        textAlign: "center",
        mt: { xs: 4, sm: 8, md: 9 },
        position: "relative",
        color: theme.palette.text.primary,
      }}
    >
      {/* Main Title */}
      <Typography variant="h2">{mainTitle}</Typography>

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
        // MOBILE VIEW: Header with DropMenu and navigation bar are rendered outside the main content flow
        <>
          <Header fixed={true} />
          {MainContent}
        </>
      )}

      {/* Logout Snackbar - shown when user logs out */}
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

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={showLogoutConfirmation}
        onClose={handleCancelLogout}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: "300px",
            backgroundColor: theme.palette.decorative.green,
          },
        }}
      >
        <DialogContent
          sx={{
            py: 3,
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant={isDesktop ? "h4" : "h5"}
            sx={{
              mb: 3,
              fontWeight: "bold",
            }}
          >
            Möchtest du dich wirklich ausloggen?
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancelLogout}
              disabled={isLoggingOut}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                color: theme.palette.text.primary,
                borderColor: theme.palette.text.primary,
                backgroundColor: theme.palette.background.default,
                "&:hover": {
                  borderColor: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            >
              Nein
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                backgroundColor: theme.palette.primary.main,
              }}
            >
              Ja, ausloggen
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Homescreen;
