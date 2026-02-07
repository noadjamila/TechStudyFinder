import React from "react";
import { Box, BoxProps } from "@mui/material";
import theme from "../../theme/theme";

interface GreenCardProps extends BoxProps {
  children: React.ReactNode;
  hideMascot?: boolean;
}

/**
 * GreenCard component.
 * A reusable centered green card component used across all pages (Homescreen, Favorites).
 * Provides consistent styling with responsive sizing for mobile and desktop views.
 *
 * @param {GreenCardProps} props - The component's props.
 * @returns {React.FC} The rendered GreenCard component.
 */
const GreenCard: React.FC<GreenCardProps> = ({
  children,
  hideMascot,
  ...props
}) => {
  const cardStyles = {
    width: "100%",
    maxWidth: {
      xs: 320,
      md: 540,
      lg: 700,
    },
    px: { xs: 2, md: 8 },
    py: { xs: 4, md: 5 },
    mx: "auto",
    backgroundColor: theme.palette.decorative.green,
    borderRadius: 4,
    boxShadow: 3,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
    mt: hideMascot ? { xs: -4, md: -6 } : 0,
  };

  return (
    <Box sx={{ ...cardStyles, ...props.sx }} {...props}>
      {!hideMascot && (
        <Box
          component="img"
          src="/mascot_standing_blue.svg"
          alt="Maskottchen"
          sx={{
            position: "absolute",
            width: 40,
            top: -60,
            right: { xs: 40, md: 20 },
          }}
        />
      )}
      {children}
    </Box>
  );
};

export default GreenCard;
