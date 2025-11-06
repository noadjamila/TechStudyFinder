import React, { useState } from "react";
import QuizCard from "../components/quiz/QuizCard_L2";
import QuizLayout from "../layouts/QuizLayout";
import { RiasecType, initialScores } from "../types/RiasecTypes";

/* TODO: Load questions from the backend */
const questions = [
  { question: "R: Magst du das?", type: RiasecType.R },
  { question: "I: Magst du das?", type: RiasecType.I },
  { question: "R: Magst du das?", type: RiasecType.R },
  { question: "S: Magst du das?", type: RiasecType.S },
];
const TOTAL_QUESTIONS = questions.length;

/**
 * `QuizPage_L2` is the page-component for the second level of the quiz.
 * It manages quiz state (current question, user responses, and scoring)
 * and renders the corresponding `QuizCard` and `QuizLayout` components.
 *
 * The component calculates a RIASEC score based on user answers as well as 
 * the three highest scores at the end of the quiz. 
 * It also displays a debug summary of all scores and the top three results when the quiz ends.
 *
 * @description
 * - Uses local state to track the current question index and score per RIASEC type.
 * - Increments or decrements scores depending on user selection ("yes", "no", or "skip").
 * - Displays the current quiz question using `QuizCard`.
 * - Shows final results (debug view) when all questions are answered.
 *
 * @returns {JSX.Element} A rendered quiz interface with progress tracking and scoring.
 */
const QuizPage_L2: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const [scores, setScores] =
    useState<Record<RiasecType, number>>(initialScores);

  const [highestScores, setHighestScores] = useState<
    { type: RiasecType; score: number }[]
  >([]);

  const currentQuestion = questions[currentIndex];

  /**
   * Advances to the next question without exceeding the total count.
   */
  const next = () => setCurrentIndex((i) => Math.min(TOTAL_QUESTIONS, i + 1));

  /**
   * Returns the top three RIASEC scores sorted in descending order.
   *
   * @param {Record<RiasecType, number>} scores - The current RIASEC score map.
   * @returns {{ type: RiasecType; score: number }[]} The top three score entries.
   */
  function getTopThreeScores(scores: Record<RiasecType, number>) {
    return Object.entries(scores)
      .map(([type, score]) => ({ type: type as RiasecType, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  /**
   * Handles the user’s answer selection for the current question.
   * Updates scores, logs results for debugging, and triggers progression.
   *
   * @param {"yes" | "no" | "skip"} option - The selected answer option.
   */
  const handleSelect = (option: string) => {
    const currentType = currentQuestion.type;

    const pointsMap: Record<string, number> = {
      yes: 1,
      no: -1,
      skip: 0,
    };
    const points = pointsMap[option] ?? 0;

    setScores((prev) => {
      const newScores = { ...prev, [currentType]: prev[currentType] + points };

      console.log("Scores:");
      Object.entries(newScores).forEach(([type, score]) =>
        console.log(`Typ: ${type}, Score: ${score}`),
      );

      if (currentIndex === TOTAL_QUESTIONS - 1) {
        const topScores = getTopThreeScores(newScores);
        setHighestScores(topScores);
      }

      return newScores;
    });

    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS) next();
    }, 300);
  };

  return (
    <div>
      {currentIndex < TOTAL_QUESTIONS ? (
        <QuizLayout 
          currentIndex={currentIndex + 1} 
          questionsTotal={TOTAL_QUESTIONS}
        >
          <QuizCard
                question={currentQuestion.question}
                onSelect={(option) => handleSelect(option)}
              />
        </QuizLayout>
      ) : (
        <div>
          Debug-Screen
          <div>
            <h3>Scores:</h3>
            {Object.entries(scores).map(([type, score]) => (
              <div key={type}>
                {type}: {score}
              </div>
            ))}
            <h3>Highest Three:</h3>
            {highestScores.map((s) => (
              <div key={s.type}>
                {s.type}: {s.score}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage_L2;
