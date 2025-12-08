import React, { ReactNode } from "react";
import { Box, useTheme } from "@mui/material";
import NavBar from "../../src/components/nav-bar/NavBar";
//import Logo from '../components/logo-menu/LogoMenu';

interface DesktopLayoutProps {
  children: ReactNode;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        bgcolor: theme.palette.background.paper,
        justifyContent: "center",
        alignItems: "center",
        py: 8,
        px: 10,
        position: "relative",
      }}
    >
      {/* Navigation Items (vertikal zentriert) */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          left: 0,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NavBar isSidebarMode={true} />
      </Box>

      {/* 2. HAUPTINHALTS-CONTAINER (Der weiße, zentrierte Kasten) */}
      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 800,
          height: "90vh",
          flexGrow: 1,
          display: "flex",
          bgcolor: theme.palette.background.default,
          borderRadius: 10,
          py: 3, // Vertikales Padding, damit der Kasten nicht den ganzen Bildschirm füllt
          px: 7, // Horizontales Padding
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DesktopLayout;
