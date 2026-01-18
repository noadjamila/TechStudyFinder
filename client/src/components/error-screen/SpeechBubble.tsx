import * as React from "react";
import { Box } from "@mui/material";

type SpeechBubbleProps = {
  children: React.ReactNode;
  maxWidth?: number;
};

/**
 * Displays a circular speech bubble with a tail pointing down-left.
 * Used in error screens to show messages from the mascot.
 * The bubble is created using CSS with a rotated triangle tail.
 *
 * @param {React.ReactNode} children - Content to display inside the speech bubble
 * @param {number} [maxWidth] - Optional maximum width for the bubble
 */
export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: 230,
        height: 240,
        borderRadius: "50%",
        backgroundColor: "background.paper",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -20,
          left: "10%",
          width: 0,
          height: 0,
          borderLeft: "23.85px solid transparent",
          borderRight: "23.85px solid transparent",
          borderTop: "69.76px solid",
          borderTopColor: "background.paper",
          transform: "rotate(35deg)",
          transformOrigin: "top center",
        },
      }}
    >
      {children}
    </Box>
  );
};
