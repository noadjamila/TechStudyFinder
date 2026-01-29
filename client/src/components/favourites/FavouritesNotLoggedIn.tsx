import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../buttons/PrimaryButton";
import GreenCard from "../cards/GreenCardBaseNotQuiz";
import theme from "../../theme/theme";

/**
 * FavouritesNotLoggedIn component content.
 * Displays a message prompting the user to log in to view favorites.
 * Used by the Favourites page when user is not authenticated.
 *
 * @returns {React.FC} The rendered content
 */
const FavouritesNotLoggedIn: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login", { state: { redirectTo: "/favorites" } });
  };

  const cardTitle = "Logge dich ein, um deine Favoriten zu sehen.";

  return (
    <Box
      sx={{
        textAlign: "center",
        mt: { xs: 4, sm: 8 },
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        color="text.header"
        sx={{
          marginBottom: 3,
          fontWeight: 700,
          fontSize: "2.5rem",
          "@media (max-width:600px)": {
            fontSize: "2rem",
          },
        }}
      >
        Meine Favoriten
      </Typography>

      <Box
        className="page-content-wrapper"
        sx={{
          overflow: "visible",
          maxWidth: "100%",
          textAlign: "center",
          mt: { xs: -22, sm: 20, md: 15 },
          minHeight: { xs: "100vh", sm: "auto" },
          position: "relative",
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <GreenCard>
          <Typography variant="subtitle1" sx={{ mb: 3, lineHeight: 1.3 }}>
            {cardTitle}
          </Typography>

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
    </Box>
  );
};

export default FavouritesNotLoggedIn;
