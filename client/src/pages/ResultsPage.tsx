import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
import { StudyProgramme } from "../types/StudyProgramme.types";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router-dom";
import { getStudyProgrammeById, getQuizResults } from "../api/quizApi";
import NoResultsYet from "../components/quiz/NoResultsYet";
import { useAuth } from "../contexts/AuthContext";

/**
 * ResultsPage component displays the results of the quiz.
 * It fetches study programmes based on quiz results from navigation state or database.
 * @returns JSX.Element
 */
const ResultsPage: React.FC = () => {
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const idsFromQuiz = location.state?.idsFromLevel2 || [];

  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasQuizResults, setHasQuizResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudyProgrammes = async () => {
      // Wait for authentication to complete before proceeding
      if (authLoading) {
        setLoading(true); // Keep showing loading state while auth is processing
        return;
      }

      setLoading(true);

      let idsToFetch: string[] = [];

      // Scenario 1: Fresh quiz completion - use IDs from navigation state
      if (location.state?.idsFromLevel2 !== undefined) {
        idsToFetch = idsFromQuiz;
      }
      // Scenario 2: No navigation state but user is logged in - fetch from DB
      else if (user) {
        try {
          const savedIds = await getQuizResults();
          if (savedIds) {
            idsToFetch = savedIds;
          }
        } catch (err) {
          console.error("Failed to load saved quiz results:", err);
          setError("Fehler beim Laden der gespeicherten Ergebnisse");
          setHasQuizResults(true); // Set to true so error can be displayed
          setLoading(false);
          return;
        }
      }

      // No IDs to fetch - show NoResultsYet
      if (idsToFetch.length === 0) {
        setStudyProgrammes([]);
        setHasQuizResults(false);
        setLoading(false);
        return;
      }

      // Fetch study programmes for the IDs
      const promises = idsToFetch.map((id: string) =>
        getStudyProgrammeById(id),
      );
      const results = await Promise.allSettled(promises);

      // Process results - filter successful ones and log failures
      const validResults: StudyProgramme[] = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value !== null) {
          validResults.push(result.value);
        } else if (result.status === "rejected") {
          console.error(
            `Failed to load study programme ${idsToFetch[index]}:`,
            result.reason,
          );
        } else if (result.status === "fulfilled" && result.value === null) {
          console.warn(`Study programme ${idsToFetch[index]} not found (404)`);
        }
      });

      // Only show error if ALL programmes failed to load
      if (validResults.length === 0 && idsToFetch.length > 0) {
        console.error("All study programmes failed to load");
        setError("Fehler beim Laden der Studiengänge");
        setHasQuizResults(true); // Set to true so error can be displayed
      } else {
        setHasQuizResults(validResults.length > 0);
      }

      setStudyProgrammes(validResults);
      setLoading(false);
    };

    fetchStudyProgrammes();
  }, [location.state, user?.id, authLoading]); // Re-run when navigation state, user, or auth loading state changes

  // Show dialog when closing the browser/tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!user && hasQuizResults) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user, hasQuizResults]);

  return (
    <MainLayout>
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>Lädt...</Box>
      ) : !hasQuizResults ? (
        <NoResultsYet />
      ) : (
        <>
          <DataSource />
          {error ? (
            <Box sx={{ textAlign: "center", mt: 4, color: "error.main" }}>
              {error}
            </Box>
          ) : (
            <Results studyProgrammes={studyProgrammes} />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default ResultsPage;
