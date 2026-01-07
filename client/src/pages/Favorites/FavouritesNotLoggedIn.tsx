import React, { useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import theme from "../../theme/theme";
import LogoMenu from "../../components/logo-menu/LogoMenu";
import DesktopLayout from "../../layouts/DesktopLayout";
import { useNavigate } from "react-router-dom";
import Button from "../../components/buttons/PrimaryButton";
import GreenCard from "../../components/cards/GreenCardBaseNotQuiz";

/**
 * FavouritesNotLoggedIn component.
 * Renders a screen for users who are not logged in and click on the Favorites button.
 * Displays a centered green card with a message prompting the user to log in.
 *
 * @returns {React.FC} The rendered FavouritesNotLoggedIn component.
 */
const FavouritesNotLoggedIn: React.FC = () => {
  const muiTheme = useTheme();
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const [menuToggled, setMenuToggled] = useState(false);

  const handleMenuToggle = () => {
    setMenuToggled(!menuToggled);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const cardTitle = "Logge dich ein, um deine Favoriten zu sehen.";

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
        mt: { xs: 16, sm: 41, md: -3 },
        position: "relative",
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: { xs: "auto", md: "calc(100vh - 50px)" },
      }}
    >
      {/* Green Card Container */}
      <GreenCard>
        {/* Card Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.subHeader,
            mb: 3,
          }}
        >
          {cardTitle}
        </Typography>

        {/* Login Button */}
        <Button
          label="Login"
          variant="contained"
          color="primary"
          onClick={handleLoginClick}
        >
          Login
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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <LogoMenu />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {MainContent}
      </Box>
    </Box>
  );
};

export default FavouritesNotLoggedIn;
