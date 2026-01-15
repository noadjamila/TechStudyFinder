import * as React from "react";
import { Box } from "@mui/material";

type SpeechBubbleProps = {
  children: React.ReactNode;
  maxWidth?: number;
};

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
