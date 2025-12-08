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
  question: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

/**
 * A generic, styled React component that renders a single question card.
 *
 * It uses Material UI (MUI) components (Card, Typography, etc.)
 * and applies custom theming for card colors.
 * @param question: The question text to display on the card.
 * @param sx: Optional styling overrides for the card.
 * @param children: Optional child components to render inside the card.
 * @constructor
 */
const BaseCard = ({ question, sx, children }: QuizCardBaseProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: "relative",
        maxWidth: {
          xs: 320,
          md: 540,
          lg: 700,
        },
        width: "100%",
        minHeight: "80px",
        mx: "auto",
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.decorative.green,
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
        {question}
      </Typography>

      {children && <div style={{ marginTop: "1rem" }}>{children}</div>}
    </Card>
  );
};

export default BaseCard;
