import React, { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import theme from "../../theme/theme";
import DesktopLayout from "../../layouts/DesktopLayout";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import Button from "../../components/buttons/PrimaryButton";
import GreenCard from "../../components/cards/GreenCardBaseNotQuiz";

/**
 * FavouritesEmpty component.
 * Renders a screen for users who are logged in but have no favorites yet.
 * Displays a centered green card with a message and prompts the user to start the quiz.
 *
 * @returns {React.FC} The rendered FavouritesEmpty component.
 */
const FavouritesEmpty: React.FC = () => {
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const [menuToggled, setMenuToggled] = useState(false);

  /**
   * Check if user is logged in on component mount
   * If not logged in, redirect to FavouritesNotLoggedIn page
   */
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch("/api/users/favorites");

        // If 401, user is not authenticated
        if (response.status === 401) {
          navigate("/favorites");
          return;
        }

        // If 200, user is authenticated
        if (response.ok) {
          const data = await response.json();
          // If user has favorites, redirect to the full favorites page
          if (data.favorites && data.favorites.length > 0) {
            // TODO: Create and navigate to a favorites list page
            console.debug("User has favorites:", data.favorites);
          }
        }
      } catch (err) {
        console.error("Error checking user status:", err);
      }
    };

    checkUserStatus();
  }, [navigate]);

  const handleMenuToggle = () => {
    setMenuToggled(!menuToggled);
  };

  const handleQuizStart = () => {
    navigate("/quiz");
  };

  const cardTitle = "Noch keine Favoriten vorhanden.";

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
        mt: { xs: -10, sm: 40, md: 32 },
        minHeight: { xs: "100vh", sm: "auto" },
        position: "relative",
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: { xs: "center", sm: "flex-start" },
      }}
    >
      {/* Green Card Container */}
      <GreenCard>
        {/* Card Title */}
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.subHeader,
            mb: 3,
          }}
        >
          {cardTitle}
        </Typography>

        {/* Quiz Start Button */}
        <Button
          label="Quiz beginnen"
          variant="contained"
          color="primary"
          onClick={handleQuizStart}
        >
          Quiz beginnen
        </Button>
      </GreenCard>
    </Box>
  );

  // For Desktop view
  if (isDesktop) {
    return (
      <DesktopLayout onMenuToggle={handleMenuToggle}>
        {MainContent}
      </DesktopLayout>
    );
  }

  // For Mobile view
  return <MainLayout>{MainContent}</MainLayout>;
};

export default FavouritesEmpty;
