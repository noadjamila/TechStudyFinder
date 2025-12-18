import { useState } from "react";
import QuizPage_L1 from "./QuizPage_L1";
import QuizPage_L2 from "./QuizPage_L2";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Manages the multi-level quiz flow.
 * It handles transitions between the quiz levels,
 * maintaining state for selected IDs from level to level.
 *
 * @returns {JSX.Element | null} The current level's quiz page or null if completed.
 */
export default function QuizFlow() {
  const { level: levelParam } = useParams<{ level: string }>();
  const currentLevel = (levelParam ? parseInt(levelParam) : 1) as 1 | 2 | 3;
  const [idsFromLevel1, setIdsFromLevel1] = useState<number[]>([]);
  const navigate = useNavigate();

  if (currentLevel === 1) {
    return (
      <QuizPage_L1
        onNextLevel={(ids) => {
          setIdsFromLevel1(ids);
          navigate("/level-success/2");
        }}
      />
    );
  }

  if (currentLevel === 2) {
    return (
      <QuizPage_L2
        previousIds={idsFromLevel1}
        oneLevelBack={() => {
          navigate("/quiz/level/1");
        }}
      />
    );
  }

  return null;
}
