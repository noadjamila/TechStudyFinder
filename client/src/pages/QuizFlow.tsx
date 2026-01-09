import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz_L1 from "../components/quiz/Quiz_L1";
import Quiz_L2 from "../components/quiz/Quiz_L2";
import LevelSuccessScreen from "../components/quiz/LevelSuccessScreen";
import { Answer, AnswerMap } from "../types/QuizAnswer.types";

type Level = 1 | 2 | 3;

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
    if (showResults && showLevelSuccess === false) {
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
        onComplete={() => {
          setCurrentLevel(3);
          setShowLevelSuccess(true);
          setShowResults(true);
        }}
        oneLevelBack={handleLevelBack}
      />
    );
  }

  return null;
}
