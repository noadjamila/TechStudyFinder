import React, { useState, useEffect } from "react";
import { useMediaQuery, useTheme, Box } from "@mui/material";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
import { StudyProgramme } from "../types/StudyProgramme.types";
import LogoMenu from "../components/logo-menu/LogoMenu";
import Navigationbar from "../components/nav-bar/NavBar";
import DesktopLayout from "../layouts/DesktopLayout";
import { useLocation } from "react-router-dom";
import { getStudyProgrammeById } from "../api/quizApi";

const ResultsPage: React.FC = () => {
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));

  const location = useLocation();
  const previousIds = location.state?.idsFromLevel2 || [];

  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyProgrammes = async () => {
      if (previousIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const promises = previousIds.map((id: string) =>
          getStudyProgrammeById(id),
        );
        const results = await Promise.all(promises);
        setStudyProgrammes(results);
      } catch (err) {
        console.error("Error fetching study programmes:", err);
        setError("Fehler beim Laden der Studiengänge");
      } finally {
        setLoading(false);
      }
    };

    fetchStudyProgrammes();
  }, [previousIds]);

  const MainContent = isDesktop ? (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <DataSource />
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>Lädt...</Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", mt: 4, color: "error.main" }}>
          {error}
        </Box>
      ) : (
        <Results studyProgrammes={studyProgrammes} />
      )}
    </Box>
  ) : (
    <Box sx={{ pt: "50px" }}>
      {" "}
      {/* Offset for mobile navbar */}
      <DataSource />
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>Lädt...</Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", mt: 4, color: "error.main" }}>
          {error}
        </Box>
      ) : (
        <Results studyProgrammes={studyProgrammes} />
      )}
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
