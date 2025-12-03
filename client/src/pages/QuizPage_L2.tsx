import React, { useState, useEffect } from "react";
import QuizCard from "../components/quiz/QuizCard_L2";
import QuizLayout from "../layouts/QuizLayout";
import { RiasecType, initialScores } from "../types/RiasecTypes";
import ErrorScreen from "../components/error-screen/ErrorScreen";

/**
 * `QuizPage_L2` is the page-component for the second level of the quiz.
 * It fetches level 2 questions, manages quiz state (current question,
 * user responses, and scoring), renders the corresponding `QuizCard` and
 * `QuizLayout` components and sends the top three RIASEC scores to the backend.
 *
 * The component calculates a RIASEC score based on user answers as well as
 * the three highest scores at the end of the quiz.
 * It also displays a debug summary of all scores and the top three results when the quiz ends.
 *
 * @description
 * - Fetches level 2 questions from the backend on mount.
 * - Uses local state to track the current question index and score per RIASEC type.
 * - Increments or decrements scores depending on user selection ("yes", "no", or "skip").
 * - Displays the current quiz question using `QuizCard`.
 * - Sends the top three RIASEC scores to the backend when the quiz is completed.
 * - Shows final results (debug view) when all questions are answered.
 *
 * @returns {JSX.Element} A rendered quiz interface with progress tracking and scoring.
 */
const QuizPage_L2: React.FC = () => {
  const [questions, setQuestions] = useState<
    { text: string; riasec_type: RiasecType }[]
  >([]);
  const TOTAL_QUESTIONS = questions.length;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responseCount, setResponseCount] = useState<number>(0);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );

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

  const goBack = () => {
    const previousAnswer = answers[currentIndex - 1];
    const lastQuestion = questions[currentIndex - 1];
    const lastType = lastQuestion.riasec_type;

    const pointsMap: Record<string, number> = {
      yes: 1,
      no: -1,
      skip: 0,
    };
    const points = pointsMap[previousAnswer];
    console.log(
      `Zurück von Frage ${currentIndex}: Rückgängig machen → "${previousAnswer}" = ${points} Punkte für ${lastType}`,
    );

    setScores((prev) => {
      const newScores = { ...prev, [lastType]: prev[lastType] - points };

      if (currentIndex === TOTAL_QUESTIONS - 1) {
        const topScores = getTopThreeScores(newScores);
        setHighestScores(topScores);
        sendData(topScores);
      }
      console.log("Scores nach Rückgängig:", newScores);
      return newScores;
    });
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }, 300);
  };

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
   * Saves the current selected Option.
   * Updates scores, logs results for debugging, and triggers progression.
   *
   * @param {"yes" | "no" | "skip"} option - The selected answer option.
   */
  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | "skip">>(
    {},
  );

  const handleSelect = (option: string) => {
    const currentType = currentQuestion.riasec_type;

    const pointsMap: Record<string, number> = {
      yes: 1,
      no: -1,
      skip: 0,
    };
    const points = pointsMap[option] ?? 0;
    console.log(
      `Frage ${currentIndex}: Antwort="${option}" → ${points} Punkte für ${currentType}`,
    );

    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));

    setScores((prev) => {
      const newScores = { ...prev, [currentType]: prev[currentType] + points };

      if (currentIndex === TOTAL_QUESTIONS - 1) {
        const topScores = getTopThreeScores(newScores);
        setHighestScores(topScores);
        sendData(topScores);
      }
      console.log("Neue Scores:", newScores);
      return newScores;
    });

    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS) next();
    }, 300);
  };

  /**
   * Sends the top three scores to the backend server.
   * @param topScores The top three RIASEC scores to send.
   */
  const sendData = async (topScores: { type: RiasecType; score: number }[]) => {
    try {
      const res = await fetch("http://localhost:5001/api/quiz/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: topScores,
          level: 2,
          studyProgrammeIds: [],
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      setResponseCount(result.ids.length);
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      setError({
        title: "Fehler beim Senden",
        message:
          "Der Server konnte die Daten nicht verarbeiten. Bitte versuche es später erneut.",
      });
    }
  };

  /**
   * Fetches the questions of level 2 from the backend when the component mounts.
   */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/quiz/level/${2}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.questions || data.questions.length === 0) {
          throw new Error("Keine Fragen erhalten");
        }

        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
        setError({
          title: "Fehler beim Laden der Fragen",
          message:
            "Die Fragen konnten nicht geladen werden. Bitte versuche es später erneut.",
        });
      }
    };

    fetchQuestions();
  }, []);

  // Wenn ein Fehler aufgetreten ist, zeige nur den ErrorScreen
  if (error != null) {
    return <ErrorScreen title={error.title} message={error.message} />;
  }

  return (
    <div>
      {currentIndex < TOTAL_QUESTIONS ? (
        <QuizLayout
          currentIndex={currentIndex + 1}
          questionsTotal={TOTAL_QUESTIONS}
          oneBack={goBack}
        >
          <QuizCard
            key={currentIndex}
            question={currentQuestion.text}
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
          <div>
            <h3>Studiengang IDs vom Server:</h3>
            <p>Anzahl der Studiengänge: {responseCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage_L2;
