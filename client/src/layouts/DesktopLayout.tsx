import React, { ReactNode } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import NavBar from "../../src/components/nav-bar/NavBar";
import DropMenu from "../components/DropdownMenu";

/**
 * Props for the DesktopLayout component.
 * Defines the layout structure and the interaction with child components.
 *
 * @interface DesktopLayoutProps
 * @property {ReactNode} children - The main content to be rendered inside the white container.
 * @property {() => void} onMenuToggle - Callback function to handle menu toggle
 */

interface DesktopLayoutProps {
  children: ReactNode;
  onMenuToggle: () => void;
}

/**
 * DesktopLayout component.
 * Provides a responsive layout for desktop views with a sidebar navigation,
 * a fixed header, and a centered main content area.
 *
 * @param {DesktopLayoutProps} props - The component's props.
 * @returns {React.FC} The rendered Desktop Layout component.
 */
const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    // Background Container: Fills the entire viewport with the grey background color
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Header + Logo in the top right corner */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 32,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Title and Subtitle of the Header */}
        <Box
          sx={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3">Tech Study Finder</Typography>
          <Typography variant="caption">Deine Reise zum Studiengang</Typography>
        </Box>

        {/* Logo Image */}
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{ width: 55, height: 55 }}
        />
      </Box>

      {/* Navigation Items (vertically centered on the left edge) */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          left: 0,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginLeft: "30px",
          }}
        >
          <DropMenu />
        </div>
        <NavBar isSidebarMode />
      </Box>

      {/* Main Content Wrapper (sets up space for the white box) */}
      <Box
        sx={{
          width: "calc(100% + 90px)",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          pt: 11,
          px: 14,
          pl: 13,
          pr: 1,
        }}
      >
        {/* The White Main Content Box */}
        <Box
          component="main"
          sx={{
            width: "150%",
            maxWidth: 1600,
            height: "calc(100vh - 88px)",
            bgcolor: theme.palette.background.default,
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            alignItems: "center",
            marginLeft: "0%",
            marginRight: "8%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DesktopLayout;
