import { useState, useEffect, useRef } from "react";
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
import { fetchQuestions } from "../api/quizApi";
import { loadLatestSession, saveSession } from "../session/persistQuizSession";

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

  try {
    await postFilterLevel({
      level: levelNumber,
      answers: payload,
    });
  } catch (error) {
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

  const [session, setSession] = useState<QuizSession>(() =>
    createQuizSession(),
  );
  const [showLevelSuccess, setShowLevelSuccess] = useState(true);
  const [_showResults, setShowResults] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const sessionRef = useRef(session);

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
      currentLevel: Math.min(prev.currentLevel + 1, 3) as Level,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
  }

  function goOneQuestionBack() {
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
      updatedAt: Date.now(),
    }));
  }

  function goToNextQuestion() {
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
      updatedAt: Date.now(),
    }));
  }

  useEffect(() => {
    loadLatestSession().then((stored) => {
      if (stored) {
        setSession(stored);
      } else {
        setSession(createQuizSession());
      }
      setIsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!_showResults && showLevelSuccess) return;
  }, [_showResults, showLevelSuccess]);

  useEffect(() => {
    if (!isHydrated) return;
    saveSession(session).catch((error) => {
      console.error("Failed to persist quiz session:", error);
    });
  }, [isHydrated, session]);
  function completeLevel2() {
    setShowLevelSuccess(true);
    setShowResults(true);
    const latestAnswers = sessionRef.current.answers;
    handleLevelComplete(latestAnswers, 2);
    setSession((prev) => ({
      ...prev,
      currentLevel: 3,
      currentQuestionIndex: 0,
      updatedAt: Date.now(),
    }));
    navigate("/results", { state: { answers: latestAnswers } });
  }

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
