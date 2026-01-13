import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Quiz_L1 from "../components/quiz/Quiz_L1";
import Quiz_L2 from "../components/quiz/Quiz_L2";
import LevelSuccessScreen from "../components/quiz/LevelSuccessScreen";
import { QuizSession } from "../types/QuizSession";
import { createQuizSession } from "../session/createQuizSession";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Answer, AnswerMap } from "../types/QuizAnswer.types";
import { calculateRiasecScores } from "../services/calculateRiasecScores";
import { riasecScoresToApiPayload } from "../services/riasecPayload";
import { postFilterLevel } from "../api/quizApi";
import { fetchQuestions } from "../api/quizApi";

type Level = 1 | 2 | 3;

/**
 * Handles the completion of a level by calculating RIASEC scores
 * and sending them to the backend.
 * @param answers
 * @param levelNumber - The level number that was completed.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
/**
async function handleLevelComplete(answers: AnswerMap, levelNumber: Level) {
  console.log("Level complete:", levelNumber, answers);
  const scores = calculateRiasecScores(answers);
  const payload = riasecScoresToApiPayload(scores);
  console.log("Payload:", payload);
  try {
    await postFilterLevel({
      level: levelNumber,
      answers: payload,

    });
  } catch (error) {
    console.error("Failed to post filter level data:", error);
  }
}
  */

/**
 * Manages the multi-level quiz flow.
 * It handles transitions between the quiz levels,
 * maintaining state for selected IDs from level to level.
 *
 * @returns {JSX.Element | null} The current level's quiz page or null if completed.
 */
export default function QuizFlow() {
  const navigate = useNavigate();

  const [session, setSession] = useState<QuizSession>(() =>
    createQuizSession(),
  );
  const [showLevelSuccess, setShowLevelSuccess] = useState(true);
  const [_showResults, setShowResults] = useState(false);
  const sessionRef = useRef(session);
  //const [idsFromLevel1, setIdsFromLevel1] = useState<string[]>([]);

  /**
   * Ensures that the level 2 questions are fetched from the API and stored in the session state.
   */
  async function ensureLevel2Questions() {
    setSession((prev) => {
      if (prev.level2Questions && prev.level2Questions.length > 0) {
        return prev;
      }
      return {
        ...prev,
        level2Questions: [],
      };
    });

    const questions = await fetchQuestions();

    setSession((prev) => ({
      ...prev,
      level2Questions: questions,
      updatedAt: Date.now(),
    }));
  }

  useEffect(() => {
    if (session.currentLevel === 2) {
      ensureLevel2Questions();
    }
  }, [session?.currentLevel]);

  /**
   * Updates the session state with the provided answer.
   * @param answer
   */
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

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
   * Navigates to the next level in the session, ensuring the level does not go above the maximum level (3).


  function goToNextLevel() {
    setSession((prev) => ({
      ...prev,
      currentLevel: Math.min(prev.currentLevel + 1, 3) as Level,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
  }
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
  useEffect(() => {}, [session.level1IDS]);
  /**
   * Completes the current level (Level 2) by performing the following actions:
   * - Sets the level success state to true.
   * - Displays the results.
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

    setSession((prev) => ({
      ...prev,
      resultIds: res.ids,
      currentLevel: 3,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
  }

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
        onAnswer={handleAnswer}
        onComplete={completeLevel2}
        oneLevelBack={goToPreviousLevel}
      />
    );
  }

  return null;
}
