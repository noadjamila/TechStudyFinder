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
      }}
    >
      {/*Faded card on the left side*/}
      {currentIndex > 1 && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: {
              xs: -35,
              md: -45,
            },
            width: "100%",
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

      {/*Faded card on the right side*/}
      {currentIndex < totalCards && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: {
              xs: -35,
              md: -45,
            },
            width: "100%",
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

      {/*The active card in the center*/}
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
}
