import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz_L1 from "../components/quiz/Quiz_L1";
import Quiz_L2 from "../components/quiz/Quiz_L2";
import LevelSuccessScreen from "../components/quiz/LevelSuccessScreen";
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

  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentLevel, setCurrentLevel] = useState<Level>(1);
  const [showLevelSuccess, setShowLevelSuccess] = useState(true);
  const [showResults, setShowResults] = useState(false);

  function updateAnswer(answer: Answer) {
    setAnswers((prev) => ({
      ...prev,
      [answer.questionId]: answer,
    }));
  }

  function handleLevelBack() {
    setCurrentLevel((lvl) => Math.max(lvl - 1, 1) as Level);
  }

  useEffect(() => {
    if (showResults && !showLevelSuccess) {
      navigate("/results", { state: { answers } });
    }
  }, [showResults, showLevelSuccess, answers]);

  if (showLevelSuccess) {
    return (
      <LevelSuccessScreen
        currentLevel={currentLevel}
        onContinue={() => setShowLevelSuccess(false)}
      />
    );
  }

  if (currentLevel === 1) {
    return (
      <Quiz_L1
        onAnswer={(answer: Answer) => updateAnswer(answer)}
        onComplete={() => {
          setCurrentLevel(2);
          setShowLevelSuccess(true);
        }}
      />
    );
  }

  if (currentLevel === 2) {
    return (
      <Quiz_L2
        onAnswer={updateAnswer}
        onComplete={async () => {
          setCurrentLevel(3);
          setShowLevelSuccess(true);
          setShowResults(true);
          await handleLevelComplete(answers, 2);
        }}
        oneLevelBack={handleLevelBack}
      />
    );
  }

  return null;
}
