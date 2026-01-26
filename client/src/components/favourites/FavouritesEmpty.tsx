import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "../buttons/PrimaryButton";
import GreenCard from "../cards/GreenCardBaseNotQuiz";
import theme from "../../theme/theme";

/**
 * FavouritesEmpty component content.
 * Displays a message for users who are logged in but have no favorites yet.
 * Prompts the user to start the quiz to discover study programmes.
 * Used by the Favourites page when user has no favorites.
 *
 * @returns {React.FC} The rendered content
 */
const FavouritesEmpty: React.FC = () => {
  const navigate = useNavigate();

  const handleQuizStart = () => {
    navigate("/quiz");
  };

  const cardTitle = "Noch keine Favoriten vorhanden.";

  return (
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
      <GreenCard>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.subHeader,
            mb: 3,
          }}
        >
          {cardTitle}
        </Typography>

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
};

export default FavouritesEmpty;
