/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import { Box, Typography } from "@mui/material";
import theme from "../theme/theme";

type GreetingBubbleProps = {
  username: string;
};

/**
 * A cheerful greeting component featuring the standing yellow mascot
 * with a custom speech bubble in a bright yellow color.
 *
 * @param {string} username - The username to include in the greeting
 */
export const GreetingBubble: React.FC<GreetingBubbleProps> = ({ username }) => {
  const greetingText = `Hallo, ${username}!`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1, sm: 2 },
        mb: { xs: 3, sm: 4, md: 6 },
        width: "100%",
      }}
    >
      {/* Speech Bubble */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: theme.palette.decorative.pink,
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
          flex: "0 1 auto",
          // Tail pointing to the right (towards mascot)
          "&::after": {
            content: '""',
            position: "absolute",
            right: "-8px",
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderLeft: `8px solid ${theme.palette.decorative.pink}`,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: theme.palette.text.primary,
            textAlign: "center",
            fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
          }}
        >
          {greetingText}
        </Typography>
      </Box>

      {/* Mascot Image */}
      <Box
        component="img"
        src="/mascot_standing_blue.svg"
        alt="Greeting mascot"
        sx={{
          height: { xs: 80, sm: 100, md: 120 },
          width: "auto",
          flexShrink: 0,
        }}
      />
    </Box>
  );
};
