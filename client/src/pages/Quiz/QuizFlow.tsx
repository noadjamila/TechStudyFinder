import { useState } from "react";
import QuizPage_L1 from "./QuizPage_L1";
import QuizPage_L2 from "./QuizPage_L2";
import { useNavigate } from "react-router-dom";

/**
 * Manages the multi-level quiz flow.
 * It handles transitions between the quiz levels,
 * maintaining state for selected IDs from level to level.
 *
 * @returns {JSX.Element | null} The current level's quiz page or null if completed.
 */
export default function QuizFlow() {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [idsFromLevel1, setIdsFromLevel1] = useState<number[]>([]);
  const navigate = useNavigate();

  if (level === 1) {
    return (
      <QuizPage_L1
        onNextLevel={(ids) => {
          setIdsFromLevel1(ids);
          setLevel(2);
          navigate("/quiz/level/2");
        }}
      />
    );
  }

  if (level === 2) {
    return (
      <QuizPage_L2
        previousIds={idsFromLevel1}
        oneLevelBack={() => {
          setLevel(1);
        }}
        navigateToResults={() => navigate("/results")}
      />
    );
  }

  return null;
}
