import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
import { StudyProgramme } from "../types/StudyProgramme.types";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router-dom";
import { getStudyProgrammeById } from "../api/quizApi";
import NoResultsYet from "../components/quiz/NoResultsYet";

/**
 * ResultsPage component displays the results of the quiz.
 * It fetches study programmes based on quiz results or cached data.
 * @returns JSX.Element
 */
const ResultsPage: React.FC = () => {
  const location = useLocation();
  const idsFromQuiz = location.state?.idsFromLevel2 || [];

  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState<boolean>(idsFromQuiz.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [hasQuizResults, setHasQuizResults] = useState<boolean>(
    idsFromQuiz.length > 0,
  );

  useEffect(() => {
    const fetchStudyProgrammes = async () => {
      // Check if we have new quiz results (even if empty array was explicitly passed)
      if (location.state?.idsFromLevel2 !== undefined) {
        if (idsFromQuiz.length === 0) {
          // Quiz returned no results
          setStudyProgrammes([]);
          setHasQuizResults(true); // User completed quiz, just got no results
          setLoading(false);
          return;
        }

        // Fetch new results
        setLoading(true);
        const promises = idsFromQuiz.map((id: string) =>
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
              `Failed to load study programme ${idsFromQuiz[index]}:`,
              result.reason,
            );
          } else if (result.status === "fulfilled" && result.value === null) {
            console.warn(
              `Study programme ${idsFromQuiz[index]} not found (404)`,
            );
          }
        });

        // Only show error if ALL programmes failed to load
        if (validResults.length === 0 && idsFromQuiz.length > 0) {
          console.error("All study programmes failed to load");
          setError("Fehler beim Laden der Studiengänge");
        }

        setStudyProgrammes(validResults);
        setHasQuizResults(true);
        setLoading(false);
      }
    };

    fetchStudyProgrammes();
  }, [idsFromQuiz.join(",")]); // Only re-run when IDs change

  return (
    <MainLayout>
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
    </MainLayout>
  );
};

export default ResultsPage;
