import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import CardStack from "../cards/CardStackLevel2";
import theme from "../../theme/theme";
import StartButton from "../buttons/PrimaryButton";

interface EmptyStateCardProps {
  message: ReactNode;
  buttonLabel: string;
  onButtonClick: () => void;
}

/**
 * EmptyStateCard displays a card with mascot, message, and action button.
 * Reusable component for empty states like no results or no quiz completed.
 */
const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  message,
  buttonLabel,
  onButtonClick,
}) => {
  return (
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

        {/* Card Text */}
        <Typography
          variant="subtitle1"
          sx={{
            mb: 3,
            lineHeight: 1.3,
          }}
        >
          {message}
        </Typography>

        {/* Action Button */}
        <StartButton
          label={buttonLabel}
          onClick={onButtonClick}
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
  );
};

export default EmptyStateCard;
