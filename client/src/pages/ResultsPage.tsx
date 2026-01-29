import React, { useState, useEffect, useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import Results from "../components/quiz/Results";
import { StudyProgramme } from "../types/StudyProgramme.types";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router-dom";
import { getQuizResults, getStudyProgrammeById } from "../api/quizApi";
import NoResultsYet from "../components/quiz/NoResultsYet";
import {
  loadQuizResults,
  saveQuizResults,
} from "../session/persistQuizSession";
import { useAuth } from "../contexts/AuthContext";

/**
 * ResultsPage component displays the results of the quiz.
 * It fetches study programmes based on quiz results from navigation state or database.
 * @returns JSX.Element
 */
const ResultsPage: React.FC = () => {
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  type ResultId = string | { studiengang_id: string };

  const rawResultIds: ResultId[] =
    location.state?.idsFromLevel2 ?? location.state?.resultIds ?? [];

  const idsFromQuiz: string[] = useMemo(() => {
    return (rawResultIds ?? [])
      .map((r) => (typeof r === "string" ? r : r?.studiengang_id))
      .filter((id): id is string => typeof id === "string" && id.length > 0);
  }, [rawResultIds]);
  const ACTIVE_RESULTS_KEY = "activeQuizResults";
  const [studyProgrammes, setStudyProgrammes] = useState<StudyProgramme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasQuizResults, setHasQuizResults] = useState<boolean>(() => {
    return location.state?.resultIds !== undefined;
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStudyProgrammes = async () => {
      if (authLoading) {
        if (!isMounted) return;
        setLoading(true);
        return;
      }

      if (!isMounted) return;
      setLoading(true);
      setError(null);

      try {
        let idsToFetch: string[] = [];

        const hasNav =
          location.state?.idsFromLevel2 !== undefined ||
          location.state?.resultIds !== undefined;

        // Scenario 1: Fresh quiz completion - use IDs from navigation state
        if (hasNav) {
          idsToFetch = idsFromQuiz;
          sessionStorage.setItem(ACTIVE_RESULTS_KEY, "1");
        }
        // Scenario 2: user logged in - fetch from DB
        else if (user) {
          const savedIds = await getQuizResults();
          if (Array.isArray(savedIds)) idsToFetch = savedIds;

          if (idsToFetch.length > 0) {
            sessionStorage.setItem(ACTIVE_RESULTS_KEY, "1");
          }
        }
        // Scenario 3: guest without saved IDs - load cached programmes
        else {
          const hasActiveFlag =
            sessionStorage.getItem(ACTIVE_RESULTS_KEY) === "1";
          if (!hasActiveFlag) {
            setStudyProgrammes([]);
            setHasQuizResults(false);
            return;
          }

          const cached = await loadQuizResults();
          if (!isMounted) return;

          if (cached && cached.length > 0) {
            setStudyProgrammes(cached);
            setHasQuizResults(true);
          } else {
            setStudyProgrammes([]);
            setHasQuizResults(false);
            sessionStorage.removeItem(ACTIVE_RESULTS_KEY);
          }
          return;
        }

        if (idsToFetch.length === 0) {
          sessionStorage.removeItem(ACTIVE_RESULTS_KEY);
          setStudyProgrammes([]);
          setHasQuizResults(false);
          return;
        }

        // Fetch programmes
        const results = await Promise.allSettled(
          idsToFetch.map((id) => getStudyProgrammeById(id)),
        );

        const validResults: StudyProgramme[] = [];
        results.forEach((r, i) => {
          if (r.status === "fulfilled" && r.value) validResults.push(r.value);
          else if (r.status === "rejected") {
            console.error(
              `Failed to load study programme ${idsToFetch[i]}:`,
              r.reason,
            );
          }
        });

        // Persist to IndexedDB
        try {
          await saveQuizResults(validResults);
        } catch (e) {
          console.warn("Failed to cache results locally (IndexedDB):", e);
        }

        if (validResults.length === 0) {
          setError("Fehler beim Laden der Studiengänge");
          setHasQuizResults(true);
          setStudyProgrammes([]);
          return;
        }

        setStudyProgrammes(validResults);
        setHasQuizResults(true);
      } catch (err) {
        console.error("Unexpected error in ResultsPage:", err);
        if (!isMounted) return;
        setError("Unerwarteter Fehler beim Laden der Ergebnisse");
        setHasQuizResults(true);
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchStudyProgrammes();

    return () => {
      isMounted = false;
    };
  }, [location.state, user?.id, authLoading]);
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const active = sessionStorage.getItem(ACTIVE_RESULTS_KEY) === "1";
      const hasResultsNow = studyProgrammes.length > 0;

      if (!user && active && hasResultsNow) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [user, studyProgrammes.length]);

  return (
    <MainLayout hasResults={hasQuizResults}>
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress data-testid="loading-spinner" />
        </Box>
      ) : !hasQuizResults ? (
        <NoResultsYet />
      ) : error ? (
        <Box sx={{ textAlign: "center", mt: 4, color: "error.main" }}>
          {error}
        </Box>
      ) : (
        <Results studyProgrammes={studyProgrammes} />
      )}
    </MainLayout>
  );
};

export default ResultsPage;
