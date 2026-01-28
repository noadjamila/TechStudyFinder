import DesktopLayout from "./DesktopLayout";
import Header from "../components/Header";
import Navigationbar from "../components/nav-bar/NavBar";
import { useMediaQuery, useTheme, Box } from "@mui/material";
import React from "react";

/**
 * Main layout of the application.
 * Provides a responsive design with automatic switching
 * between mobile and desktop views.
 *
 * @param {{ children: React.ReactNode }} props - The layout props.
 * @returns {JSX.Element} The main layout component.
 */
export default function MainLayout({
  children,
  hasResults = false,
}: {
  children: React.ReactNode;
  hasResults?: boolean;
}) {
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));

  const MainContent = isDesktop ? (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {children}
    </Box>
  ) : (
    <Box sx={{ pt: "50px" }}>
      {" "}
      {/* Offset for mobile navbar */}
      {children}
    </Box>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflow: "auto",
      }}
    >
      {/* Conditional Rendering based on viewport size */}
      {isDesktop ? (
        // DESKTOP VIEW: Content is placed inside the structured layout
        <DesktopLayout onMenuToggle={toggleSidebar} hasResults={hasResults}>
          <div
            style={{
              padding: "30px",
              paddingRight: "60px",
              paddingLeft: "60px",
              width: "100%",
            }}
          >
            {MainContent}
          </div>
        </DesktopLayout>
      ) : (
        // MOBILE VIEW: Logo menu and navigation bar are rendered outside the main content flow
        <>
          <Header fixed={true} hasResults={hasResults} />
          <Navigationbar hasResults={hasResults} />

          <div
            style={{
              padding: "30px",
              paddingTop: "50px",
            }}
          >
            {MainContent}
          </div>
        </>
      )}
    </div>
  );
}
