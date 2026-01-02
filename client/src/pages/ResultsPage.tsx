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
import NoResultsYet from "../components/quiz/NoResultsYet";

const ResultsPage: React.FC = () => {
  const muiTheme = useTheme();
  const toggleSidebar = () => {};
  const isDesktop = useMediaQuery(muiTheme.breakpoints.up("sm"));

  const location = useLocation();
  const idsFromQuiz = location.state?.idsFromLevel2 || [];

  // Initialize state with cached data if available (synchronous, instant)
  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>(
    () => {
      if (idsFromQuiz.length === 0) {
        // Try to load cached results immediately
        const cachedResults = localStorage.getItem("quizResults");
        if (cachedResults) {
          try {
            return JSON.parse(cachedResults);
          } catch (err) {
            console.error("Error parsing cached results:", err);
          }
        }
      }
      // New quiz results coming in, start empty
      return [];
    },
  );

  const [loading, setLoading] = useState<boolean>(idsFromQuiz.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [hasQuizResults, setHasQuizResults] = useState<boolean>(() => {
    // Check if there are cached results or quiz was completed (even with 0 results)
    return (
      idsFromQuiz.length > 0 ||
      localStorage.getItem("quizResults") !== null ||
      localStorage.getItem("quizCompleted") === "true"
    );
  });

  useEffect(() => {
    const fetchStudyProgrammes = async () => {
      // Check if we have new quiz results (even if empty array was explicitly passed)
      if (location.state?.idsFromLevel2 !== undefined) {
        if (idsFromQuiz.length === 0) {
          // Quiz returned no results - clear cache but mark quiz as completed
          localStorage.removeItem("quizResults");
          localStorage.setItem("quizCompleted", "true");
          setStudyProgrammes([]);
          setHasQuizResults(true); // User completed quiz, just got no results
          setLoading(false);
          return;
        }

        // Fetch new results
        try {
          setLoading(true);
          const promises = idsFromQuiz.map((id: string) =>
            getStudyProgrammeById(id),
          );
          const results = await Promise.all(promises);

          // Save full study programme objects to localStorage
          localStorage.setItem("quizResults", JSON.stringify(results));
          localStorage.setItem("quizCompleted", "true");
          setStudyProgrammes(results);
          setHasQuizResults(true);
        } catch (err) {
          console.error("Error fetching study programmes:", err);
          setError("Fehler beim Laden der Studiengänge");
        } finally {
          setLoading(false);
        }
      }
      // If no new IDs, we already loaded from cache in useState initializer
    };

    fetchStudyProgrammes();
  }, []);

  const MainContent = isDesktop ? (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {!hasQuizResults ? (
        <NoResultsYet />
      ) : (
        <>
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
        </>
      )}
    </Box>
  ) : (
    <Box sx={{ pt: "50px" }}>
      {" "}
      {/* Offset for mobile navbar */}
      {!hasQuizResults ? (
        <NoResultsYet />
      ) : (
        <>
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
        </>
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
