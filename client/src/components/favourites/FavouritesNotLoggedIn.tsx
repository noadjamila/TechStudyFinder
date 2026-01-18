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
      className="page-content-wrapper"
      sx={{
        overflow: "visible",
        maxWidth: "100%",
        mx: "auto",
        px: { xs: 1, sm: 0 },
        textAlign: "center",
        mt: {
          xs: 15,
          sm: 41,
          md: -3,
        },
        "@media (min-width: 380px) and (max-width: 599px)": {
          mt: 35,
        },
        position: "relative",
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: { xs: "auto", md: "calc(100vh - 50px)" },
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
  );
};

export default FavouritesNotLoggedIn;
