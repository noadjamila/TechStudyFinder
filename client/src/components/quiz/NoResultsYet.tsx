/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../../theme/theme";
import GreenCard from "../cards/GreenCardBaseNotQuiz";
import PrimaryButton from "../buttons/PrimaryButton";

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

      <Box
        className="page-content-wrapper"
        sx={{
          overflow: "visible",
          maxWidth: "100%",
          textAlign: "center",
          mt: { xs: -20, sm: 20, md: 15 },
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
            Starte jetzt das Quiz, um deine personalisierten Empfehlungen zu
            erhalten!
          </Typography>

          <PrimaryButton
            label={"Quiz beginnen"}
            onClick={handleQuizStart}
            ariaText="Quiz beginnen"
          />
        </GreenCard>
      </Box>
    </Box>
  );
};

export default NoResultsYet;
