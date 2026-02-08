/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { Box } from "@mui/material";
import theme from "../../theme/theme";

/**
 * BottomHills component that displays decorative colored hills at the bottom of the page
 * Includes a walking mascot character on top of the hills
 * @component
 * @returns {JSX.Element} Decorative bottom section with colored hills and mascot
 */
export default function BottomHills() {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: { xs: "12vh", sm: "23vh", md: "18vh", lg: "18vh" },
        display: "flex",
        zIndex: 0,
      }}
    >
      {[
        theme.palette.decorative.pink,
        theme.palette.decorative.green,
        theme.palette.decorative.blue,
        theme.palette.decorative.yellow,
      ].map((color, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            backgroundColor: color,
            borderTopLeftRadius: {
              xs: "50% 60%",
              sm: "50% 40%",
              md: "50% 50%",
              lg: "50% 80%",
            },
            borderTopRightRadius: {
              xs: "50% 60%",
              sm: "50% 40%",
              md: "50% 50%",
              lg: "50% 80%",
            },
          }}
        />
      ))}

      {/* Mascot Image on top of the hills */}
      <Box
        component="img"
        src="/mascot_climbing_yellow.svg"
        alt="Mascot"
        sx={{
          position: "absolute",
          bottom: "100%",
          left: { xs: "30%", sm: "35%", md: "33%", lg: "35%" },
          width: { xs: 60, sm: 55, md: 55, lg: 55 },
          zIndex: 1,
          objectFit: "contain",
        }}
      />
    </Box>
  );
}
