import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
import { StudyProgramme } from "../types/StudyProgramme.types";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router-dom";
import { getStudyProgrammeById } from "../api/quizApi";
import NoResultsYet from "../components/quiz/NoResultsYet";
import {
  loadQuizResults,
  saveQuizResults,
} from "../session/persistQuizSession";

/**
 * ResultsPage component displays the results of the quiz.
 * It fetches study programmes based on quiz results or cached data.
 * @returns JSX.Element
 */
const ResultsPage: React.FC = () => {
  const location = useLocation();
  const idsFromQuiz = (location.state?.resultIds ?? []).map(
    (r: { studiengang_id: string }) => r.studiengang_id,
  );

  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [hasQuizResults, setHasQuizResults] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (location.state?.resultIds !== undefined) {
        if (idsFromQuiz.length === 0) {
          await saveQuizResults([]);
          if (!isMounted) return;
          setStudyProgrammes([]);
          setHasQuizResults(true);
          setLoading(false);
          return;
        }

        setLoading(true);

        const promises = idsFromQuiz.map((id: string) =>
          getStudyProgrammeById(id),
        );

        const results = await Promise.allSettled(promises);

        const validResults: StudyProgramme[] = [];
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value) {
            validResults.push(r.value);
          }
        });

        await saveQuizResults(validResults);

        if (!isMounted) return;
        setStudyProgrammes(validResults);
        setHasQuizResults(true);
        setLoading(false);
        return;
      }

      const cached = await loadQuizResults();
      if (!isMounted) return;

      if (cached) {
        setStudyProgrammes(cached);
        setHasQuizResults(true);
      }

      setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
