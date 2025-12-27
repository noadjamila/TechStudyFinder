import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quiz_L1 from "../components/quiz/Quiz_L1";
import Quiz_L2 from "../components/quiz/Quiz_L2";
import LevelSuccessScreen from "../components/quiz/LevelSuccessScreen";

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

  const [currentLevel, setCurrentLevel] = useState<Level>(1);
  const [showLevelSuccess, setShowLevelSuccess] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [idsFromLevel1, setIdsFromLevel1] = useState<string[]>([]);
  const [idsFromLevel2, setIdsFromLevel2] = useState<string[]>([]);

  useEffect(() => {
    if (showResults && showLevelSuccess === false) {
      navigate("/results", { state: { idsFromLevel2 } });
    }
  }, [showResults, showLevelSuccess]);

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
        onNextLevel={(ids) => {
          setIdsFromLevel1(ids);
          setCurrentLevel(2);
          setShowLevelSuccess(true);
        }}
      />
    );
  }

  if (currentLevel === 2) {
    return (
      <Quiz_L2
        previousIds={idsFromLevel1}
        oneLevelBack={() => {
          setCurrentLevel(1);
        }}
        onNextLevel={(ids) => {
          setIdsFromLevel2(ids);
          setCurrentLevel(3);
          setShowLevelSuccess(true);
          setShowResults(true);
        }}
      />
    );
  }

  return null;
}
