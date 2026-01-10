import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz_L1 from "../components/quiz/Quiz_L1";
import Quiz_L2 from "../components/quiz/Quiz_L2";
import LevelSuccessScreen from "../components/quiz/LevelSuccessScreen";
import { QuizSession } from "../types/QuizSession";
import { createQuizSession } from "../session/createQuizSession";
import { Answer, AnswerMap } from "../types/QuizAnswer.types";
import { calculateRiasecScores } from "../services/calculateRiasecScores";
import { riasecScoresToApiPayload } from "../services/riasecPayload";
import { postFilterLevel } from "../api/quizApi";

type Level = 1 | 2 | 3;

/**
 * Handles the completion of a level by calculating RIASEC scores
 * and sending them to the backend.
 * @param answers
 * @param levelNumber - The level number that was completed.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function handleLevelComplete(answers: AnswerMap, levelNumber: Level) {
  const scores = calculateRiasecScores(answers);
  const payload = riasecScoresToApiPayload(scores);

  // Send the RIASEC scores to the backend
  try {
    await postFilterLevel({
      level: levelNumber,
      answers: payload,
    });
  } catch (error) {
    // Log the error so API failures do not result in unhandled promise rejections
    console.error("Failed to post filter level data:", error);
  }
}

/**
 * Manages the multi-level quiz flow.
 * It handles transitions between the quiz levels,
 * maintaining state for selected IDs from level to level.
 *
 * @returns {JSX.Element | null} The current level's quiz page or null if completed.
 */
export default function QuizFlow() {
  const navigate = useNavigate();

  /*
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentLevel, setCurrentLevel] = useState<Level>(1);
  */
  const [session, setSession] = useState<QuizSession>(() =>
    createQuizSession(),
  );
  const [showLevelSuccess, setShowLevelSuccess] = useState(true);
  const [showResults, setShowResults] = useState(false);

  function handleAnswer(answer: Answer) {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [answer.questionId]: answer,
      },
      updatedAt: Date.now(),
    }));
  }

  function goToPreviousLevel() {
    setSession((prev) => ({
      ...prev,
      currentLevel: Math.max(prev.currentLevel - 1, 1) as Level,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
  }

  function goToNextLevel() {
    setSession((prev) => ({
      ...prev,
      currentLevel: Math.max(prev.currentLevel + 1, 1) as Level,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
  }

  useEffect(() => {
    if (!showResults && showLevelSuccess) return;
    navigate("/results", { state: { answers: session.answers } });
  }, [showResults, showLevelSuccess, session, navigate]);

  if (showLevelSuccess) {
    return (
      <LevelSuccessScreen
        currentLevel={session.currentLevel}
        onContinue={() => setShowLevelSuccess(false)}
      />
    );
  }

  if (session.currentLevel === 1) {
    return (
      <Quiz_L1
        onAnswer={(answer: Answer) => handleAnswer(answer)}
        onComplete={() => {
          goToNextLevel();
          setShowLevelSuccess(true);
        }}
      />
    );
  }

  if (session.currentLevel === 2) {
    return (
      <Quiz_L2
        onAnswer={handleAnswer}
        onComplete={() => {
          goToNextLevel();
          setShowLevelSuccess(true);
          setShowResults(true);
          await handleLevelComplete(answers, 2);
        }}
        oneLevelBack={goToPreviousLevel}
      />
    );
  }

  return null;
}
