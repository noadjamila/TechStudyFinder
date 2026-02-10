/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Box, useTheme } from "@mui/material";
import React from "react";

interface CardStackProps {
  currentIndex: number;
  totalCards: number;
  children: React.ReactNode;
}

export default function CardStack({
  currentIndex,
  totalCards,
  children,
}: CardStackProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: 300,
          md: 200,
        },
        maxWidth: {
          xs: 320,
          md: 540,
          lg: 700,
        },
        mx: "auto",
        display: "flex",
        justifyContent: currentIndex === totalCards ? "flex-start" : "flex-end",
      }}
    >
      {/* Faded card on left (previous card) - shown when not on first card */}
      {currentIndex > 1 && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 0,
            alignSelf: "flex-end",
            width: "80%",
            height: "90%",
            borderRadius: 2,
            bgcolor: theme.palette.decorative.green,
            opacity: 0.4,
            transform: "scale(0.97)",
            zIndex: 0,
            boxShadow: 8,
          }}
        />
      )}

      {/* Faded card on right (next card) - shown when not on last card */}
      {currentIndex < totalCards && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 0,
            alignSelf: "flex-end",
            width: "80%",
            height: "90%",
            borderRadius: 2,
            bgcolor: theme.palette.decorative.green,
            opacity: 0.4,
            transform: "scale(0.97)",
            zIndex: 0,
            boxShadow: 8,
          }}
        />
      )}

      {/* Active card */}
      <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
}
