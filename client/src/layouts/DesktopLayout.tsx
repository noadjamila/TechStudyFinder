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
        py: 10,
        px: 12,
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
          marginRight: "120px",
          width: "90%",
          height: "90vh",
          display: "flex",
          bgcolor: theme.palette.background.default,
          borderRadius: 10,
          py: 3,
          px: 7,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DesktopLayout;
