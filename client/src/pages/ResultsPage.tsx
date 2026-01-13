import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Results from "../components/quiz/Results";
import DataSource from "../components/DataSource";
import { StudyProgramme } from "../types/StudyProgramme.types";
import MainLayout from "../layouts/MainLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { getStudyProgrammeById } from "../api/quizApi";
import NoResultsYet from "../components/quiz/NoResultsYet";
import { useAuth } from "../contexts/AuthContext";
import LoginReminderDialog from "../components/dialogs/LoginReminderDialog";

/**
 * ResultsPage component displays the results of the quiz.
 * It fetches study programmes based on quiz results or cached data.
 * @returns JSX.Element
 */
const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [showLoginReminder, setShowLoginReminder] = useState(false);
  const previousPathRef = useRef<string>("/results");
  const intendedPathRef = useRef<string | null>(null);
  const allowNavigationRef = useRef<boolean>(false);

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

        // Save full study programme objects to localStorage
        localStorage.setItem("quizResults", JSON.stringify(validResults));
        localStorage.setItem("quizCompleted", "true");
        setStudyProgrammes(validResults);
        setHasQuizResults(true);
        setLoading(false);
      }
      // If no new IDs, we already loaded from cache in useState initializer
    };

    fetchStudyProgrammes();
  }, []);

  // Show login reminder when navigating away if user is not logged in
  useEffect(() => {
    // Never show dialog if currently on login or register page
    const isOnAuthPage =
      location.pathname === "/login" || location.pathname === "/register";

    if (isOnAuthPage) {
      setShowLoginReminder(false);
      allowNavigationRef.current = false;
      previousPathRef.current = location.pathname;
      return;
    }

    // Check if we're leaving the results page
    if (
      location.pathname !== "/results" &&
      previousPathRef.current === "/results"
    ) {
      // Don't show reminder when navigating to login or register pages
      const isNavigatingToAuth =
        location.pathname === "/login" || location.pathname === "/register";

      // Only show reminder if not logged in, has results, and not going to auth pages
      if (
        !user &&
        hasQuizResults &&
        !isNavigatingToAuth &&
        !allowNavigationRef.current
      ) {
        // Store the intended path and show dialog
        intendedPathRef.current = location.pathname;
        setShowLoginReminder(true);
        // Navigate back to results temporarily
        navigate("/results");
      } else {
        // Clear flags and allow navigation to auth pages
        allowNavigationRef.current = false;
        setShowLoginReminder(false);
      }
    }
    // Update the previous path
    previousPathRef.current = location.pathname;
  }, [location.pathname, user, hasQuizResults, navigate]);

  // Handle closing the dialog - navigates to the intended destination
  const handleDialogClose = () => {
    setShowLoginReminder(false);
    allowNavigationRef.current = true;
    if (intendedPathRef.current) {
      const destination = intendedPathRef.current;
      intendedPathRef.current = null;
      navigate(destination);
    }
  };

  // Handle login button click in dialog
  const handleLoginClick = () => {
    setShowLoginReminder(false);
    allowNavigationRef.current = true;
    navigate("/login", { state: { redirectTo: "/results" } });
  };

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

      {/* Login reminder dialog for not logged in users */}
      <LoginReminderDialog
        open={showLoginReminder}
        onClose={handleDialogClose}
        onLoginClick={handleLoginClick}
        message="Beachte: du bist nicht eingeloggt. Deine Ergebnisse können nach einer Zeit nicht mehr abgerufen werden."
      />
    </MainLayout>
  );
};

export default ResultsPage;
