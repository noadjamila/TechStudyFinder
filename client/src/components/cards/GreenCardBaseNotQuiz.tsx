import React from "react";
import { Box, BoxProps } from "@mui/material";
import theme from "../../theme/theme";

interface GreenCardProps extends BoxProps {
  children: React.ReactNode;
}

/**
 * GreenCard component.
 * A reusable centered green card component used across all pages (Homescreen, Favorites).
 * Provides consistent styling with responsive sizing for mobile and desktop views.
 *
 * @param {GreenCardProps} props - The component's props.
 * @returns {React.FC} The rendered GreenCard component.
 */
const GreenCard: React.FC<GreenCardProps> = ({ children, ...props }) => {
  const cardStyles = {
    width: { xs: "90%", md: "120%" },
    maxWidth: { xs: 360, sm: 520, md: 900 },
    px: { xs: 1, md: 8 },
    py: { xs: 2, md: 3 },
    mx: "auto",
    backgroundColor: theme.palette.decorative.green,
    borderRadius: 4,
    boxShadow: 3,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
  };

  return (
    <Box sx={{ ...cardStyles, ...props.sx }} {...props}>
      {children}
    </Box>
  );
};

export default GreenCard;
