import React from "react";
import { useMediaQuery, useTheme, Box } from "@mui/material";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
import { StudyProgramme } from "../types/StudyProgramme.types";
import LogoMenu from "../components/logo-menu/LogoMenu";
import Navigationbar from "../components/nav-bar/NavBar";
import DesktopLayout from "../layouts/DesktopLayout";
import { useLocation } from "react-router-dom";

const ResultsPage: React.FC = () => {
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));

  const location = useLocation();
  const previousIds = location.state?.idsFromLevel2 || [];

  console.log("IDs received in NextLevel:", previousIds);

  const studyProgrammes: StudyProgramme[] = [
    {
      id: 1,
      name: "Communication Systems and Networks",
      university: "Technische Hochschule Köln",
      degree: "Master",
    },
    {
      id: 2,
      name: "Betriebliche Umweltinformatik",
      university: "Hochschule für Technik und Wirtschaft Berlin",
      degree: "Master",
    },
    {
      id: 3,
      name: "Informatik",
      university: "Rheinische Friedrich-Wilhelms-Universität Bonn",
      degree: "Bachelor of Science",
    },
    {
      id: 4,
      name: "Medieninformatik",
      university: "Universität zu Lübeck",
      degree: "Bachelor of Science",
    },
    {
      id: 5,
      name: "Data Science",
      university: "Ludwig-Maximilians-Universität München",
      degree: "Master of Science",
    },
  ]; // Replace with actual data retrieval logic

  const MainContent = isDesktop ? (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <DataSource />
      <Results studyProgrammes={studyProgrammes} />
    </Box>
  ) : (
    <Box sx={{ pt: "50px" }}>
      {" "}
      {/* Offset for mobile navbar */}
      <DataSource />
      <Results studyProgrammes={studyProgrammes} />
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
        <DesktopLayout onMenuToggle={toggleSidebar}>
          {MainContent}
        </DesktopLayout>
      ) : (
        // MOBILE VIEW: Logo menu and navigation bar are rendered outside the main content flow
        <>
          <LogoMenu fixed={true} />
          <Navigationbar />
          {MainContent}
        </>
      )}
    </div>
  );
};

export default ResultsPage;
