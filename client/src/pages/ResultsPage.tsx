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
  type ResultId = string | { studiengang_id: string };

  const rawResultIds: ResultId[] = location.state?.resultIds ?? [];

  const idsFromQuiz = rawResultIds
    .map((r) => (typeof r === "string" ? r : r?.studiengang_id))
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);
  const [hasQuizResults, setHasQuizResults] = useState<boolean>(() => {
    return location.state?.resultIds !== undefined;
  });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (location.state?.resultIds !== undefined) {
        setHasQuizResults(true);
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
        results.forEach((r, index) => {
          if (r.status === "fulfilled" && r.value) {
            validResults.push(r.value);
          } else if (r.status === "rejected") {
            console.error(
              `Failed to load study programme ${idsFromQuiz[index]}:`,
              r.reason,
            );
          } else if (r.status === "fulfilled" && r.value === null) {
            console.warn(
              `Study programme ${idsFromQuiz[index]} not found (404)`,
            );
          }
        });

        await saveQuizResults(validResults);

        // Only show error if ALL programmes failed to load
        if (validResults.length === 0 && idsFromQuiz.length > 0) {
          console.error("All study programmes failed to load");
          setError("Fehler beim Laden der Studiengänge");
        }

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
