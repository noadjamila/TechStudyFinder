import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CardStack from "./CardStack";
import theme from "../../theme/theme";
import StartButton from "../buttons/Button";

/**
 * NoResultsYet component displays when user hasn't completed the quiz yet.
 * Shows a card prompting them to start the quiz.
 */
const NoResultsYet: React.FC = () => {
  const navigate = useNavigate();

  const handleQuizStart = () => {
    navigate("/quiz");
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 3,
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
        Meine Ergebnisse
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 5,
          color: theme.palette.text.primary,
        }}
      >
        Keine Ergebnisse vorhanden.
      </Typography>

      <CardStack currentIndex={1} totalCards={1}>
        <Box
          sx={{
            width: { xs: "100%", md: "120%" },
            maxWidth: { xs: 360, sm: 520 },
            px: { xs: 3, md: 6 },
            py: { xs: 3, md: 4 },
            mx: "auto",
            backgroundColor: theme.palette.decorative.green,
            borderRadius: 4,
            boxShadow: 3,
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Mascot Image */}
          <Box
            component="img"
            src="/mascot_standing_blue.svg"
            alt="Maskottchen"
            sx={{
              position: "absolute",
              width: { xs: 40, sm: 40 },
              height: "auto",
              top: { xs: -60, sm: -58 },
              right: { xs: 60, sm: 50 },
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
            Starte jetzt das Quiz, um deine personalisierten Empfehlungen zu
            erhalten!
          </Typography>

          {/* Start Quiz Button */}
          <StartButton
            label="Quiz beginnen"
            onClick={handleQuizStart}
            sx={{
              borderRadius: 3,
              padding: "8px 16px",
              fontSize: "1.0rem",
              width: "fit-content",
              mx: "auto",
              display: "block",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.text.primary,
              fontWeight: "normal",
            }}
          />
        </Box>
      </CardStack>
    </Box>
  );
};

export default NoResultsYet;
