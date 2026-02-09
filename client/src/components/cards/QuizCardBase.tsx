/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import React from "react";
import { useTheme } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

/**
 * Props for the QuizCardBase component.
 * Allows parent-components the interaction and modification of this component.
 * Contains the question text and optional styling and children.
 */
export interface QuizCardBaseProps {
  cardText: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  cardColor: string;
}

/**
 * A generic, styled React component that renders a single question card.
 *
 * It uses Material UI (MUI) components (Card, Typography, etc.)
 * and applies custom theming for card colors.
 * @param cardText: The question text to display on the card.
 * @param sx: Optional styling overrides for the card.
 * @param children: Optional child components to render inside the card.
 * @param cardColor: The background color of the card.
 * @constructor
 */
const BaseCard = ({ cardText, sx, children, cardColor }: QuizCardBaseProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        minHeight: 170,
        maxWidth: {
          xs: 300,
          md: 350,
          lg: 400,
        },
        mx: "auto",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: cardColor,
        color: theme.palette.text.primary,
        overflow: "visible",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        ...sx,
      }}
    >
      {/* the question*/}
      <Typography
        variant="h5"
        component="div"
        gutterBottom
        sx={{
          mt: 1,
          px: 2,
          textAlign: "center",
        }}
      >
        {cardText}
      </Typography>

      {children && <div style={{ marginTop: "1rem" }}>{children}</div>}
    </Card>
  );
};

export default BaseCard;
