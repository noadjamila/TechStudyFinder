import { useState, useEffect, useRef, JSX } from "react";
import { useNavigate } from "react-router-dom";
import Quiz_L1 from "../components/quiz/Quiz_L1";
import Quiz_L2 from "../components/quiz/Quiz_L2";
import LevelSuccessScreen from "../components/quiz/LevelSuccessScreen";
import { QuizSession } from "../types/QuizSession";
import { createQuizSession } from "../session/createQuizSession";
import { Answer } from "../types/QuizAnswer.types";
import { calculateRiasecScores } from "../services/calculateRiasecScores";
import { riasecScoresToApiPayload } from "../services/riasecPayload";
import { postFilterLevel } from "../api/quizApi";
import { fetchQuestions } from "../api/quizApi";
import { loadLatestSession, saveSession } from "../session/persistQuizSession";

type Level = 1 | 2 | 3;

/**
 * Manages the multi-level quiz flow.
 * It handles transitions between the quiz levels,
 * maintaining state for selected IDs from level to level.
 *
 * @returns {JSX.Element | null} The current level's quiz page or null if completed.
 */
export default function QuizFlow(): JSX.Element | null {
  const navigate = useNavigate();

  const [session, setSession] = useState<QuizSession>(() =>
    createQuizSession(),
  );
  const [showLevelSuccess, setShowLevelSuccess] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [_showResults, setShowResults] = useState(false);
  const sessionRef = useRef(session);

  /**
   * only Loads in the questions for Level 2 if there are no Questions saved in Session
   */
  useEffect(() => {
    if (!isHydrated) return;
    if (session.currentLevel !== 2) return;
    if (session.level2Questions && session.level2Questions.length > 0) return;

    let isMounted = true;

    fetchQuestions().then((loadedQuestions) => {
      if (!isMounted) return;
      setSession((prev) => ({
        ...prev,
        level2Questions: loadedQuestions,
        updatedAt: Date.now(),
      }));
    });

    return () => {
      isMounted = false;
    };
  }, [isHydrated, session.currentLevel]);

  // Keep ref in sync for immediate reads during chained callbacks.
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  /**
   * Handles and processes an answer by updating the session state with the provided answer.
   *
   * @param {Answer} answer - The answer object containing the information about the question and its response.
   * @return {void} This function does not return any value.
   */
  function handleAnswer(answer: Answer) {
    const next = {
      ...sessionRef.current,
      answers: {
        ...sessionRef.current.answers,
        [answer.questionId]: answer,
      },
      updatedAt: Date.now(),
    };
    sessionRef.current = next;
    setSession(next);
  }

  /**
   * Navigates to the previous level in the session, ensuring the level does not go below the minimum level (1).
   * Resets the current question index to 0 and updates the timestamp of the session.
   *
   * @return {void} Does not return a value. Modifies the session state directly.
   */
  function goToPreviousLevel() {
    setSession((prev) => ({
      ...prev,
      currentLevel: Math.max(prev.currentLevel - 1, 1) as Level,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
  }

  /**
   * Handles the completion of Level 1 by updating the session state, progressing to the next level,
   * and showing the level success indicator.
   *
   * @param {string[]} ids - An array of IDs associated with Level 1 completion.
   * @return {void} This method does not return a value.
   */
  function handleLevel1Complete(ids: string[]) {
    setSession((prev) => ({
      ...prev,
      level1IDS: ids,
      currentLevel: 2,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
    setShowLevelSuccess(true);
  }

  /**
   * Navigates one question back in the current level of the quiz session.
   * Ensures that the question index does not go below zero.
   * Updates the session state with the new question index and timestamp.
   * @return {void} Does not return a value. Modifies the session state directly.
   */
  function goOneQuestionBack() {
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
      updatedAt: Date.now(),
    }));
  }

  /**
   * Navigates to the next question in the current level of the quiz session.
   * Increments the current question index by one and updates the session state with the new index and timestamp.
   * @return {void} Does not return a value. Modifies the session state directly.
   */
  function goToNextQuestion() {
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      updatedAt: Date.now(),
    }));
  }

  /**
   * Checks if there is a Session already saved and loads it
   */
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const stored = await loadLatestSession();
        if (!isMounted) return;
        setSession(stored ?? createQuizSession());
        setIsHydrated(true);
      } catch (error) {
        console.error("Failed to load persisted quiz session:", error);
        if (isMounted) setIsHydrated(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Saves the current Session if no other question has already been saved
   */
  useEffect(() => {
    if (!isHydrated) return;
    const id = window.setTimeout(() => {
      saveSession(session).catch((error) => {
        console.error("Failed to persist quiz session:", error);
      });
    }, 300);
    return () => {
      window.clearTimeout(id);
    };
  }, [isHydrated, session]);

  /**
   * Completes the current level (Level 2) by performing the following actions:
   * - Sets the level success state to true.
   * - Handles the completion of the level with the provided answers and level id.
   * - Updates the session to transition to the next level (Level 3), resets the question index,
   *   and updates the timestamp for when the action occurred.
   * - Navigates to the results page, passing the user's answers in the navigation state.
   */
  async function completeLevel2() {
    setShowLevelSuccess(true);
    // setShowResults(true);
    const { answers, level1IDS } = sessionRef.current;
    const scores = calculateRiasecScores(answers);
    const payload = riasecScoresToApiPayload(scores);

    const res = await postFilterLevel({
      level: 2,
      answers: payload,
      studyProgrammeIds: level1IDS,
    });
    /*
    const latestAnswers = sessionRef.current.answers;
    handleLevelComplete(latestAnswers, 2).catch((error) => {
      console.error("Error completing level 2:", error);
    });
 */ setSession((prev) => ({
      ...prev,
      resultIds: res.ids,
      currentLevel: 3,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
  }

  console.log(session.currentLevel);
  if (showLevelSuccess) {
    return (
      <LevelSuccessScreen
        currentLevel={session.currentLevel}
        onContinue={() => {
          setShowLevelSuccess(false);
          setShowResults(true);
          if (session.currentLevel === 3) {
            navigate("/results", {
              state: { resultIds: sessionRef.current.resultIds },
            });
          }
        }}
      />
    );
  }

  if (session.currentLevel === 1) {
    return (
      <Quiz_L1
        onAnswer={(answer: Answer) => handleAnswer(answer)}
        level1ids={handleLevel1Complete}
        onComplete={() => {}}
      />
    );
  }

  if (session.currentLevel === 2) {
    if (!session.level2Questions) {
      return <div>Lädt Fragen…</div>;
    }
    return (
      <Quiz_L2
        session={session}
        onAnswer={handleAnswer}
        onComplete={completeLevel2}
        oneLevelBack={goToPreviousLevel}
        onQuestionBack={goOneQuestionBack}
        onQuestionNext={goToNextQuestion}
      />
    );
  }

  return null;
}
