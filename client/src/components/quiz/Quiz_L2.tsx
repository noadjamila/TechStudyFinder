import React, { useState, useEffect } from "react";
import QuizLayout from "../../layouts/QuizLayout";
import { RiasecType, initialScores } from "../../types/RiasecTypes";
import ErrorScreen from "../error-screen/ErrorScreen";
import { useApiClient } from "../../hooks/useApiClient";
import CardStack from "../cards/CardStackLevel2";
import { Stack, Typography } from "@mui/material";
import { postFilterLevel, getQuizLevel } from "../../api/quizApi";
import BaseCard from "../cards/QuizCardBase";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import theme from "../../theme/theme";
import {
  convertQuizResponses,
  scoresToArray,
} from "../../services/level2Service";

export interface QuizL2Props {
  previousIds: string[];
  onNextLevel: (ids: string[]) => void;
  oneLevelBack: () => void;
}

/**
 * `Quiz_L2` is the component for the second level of the quiz.
 * It fetches level 2 questions, manages quiz state (current question,
 * user responses, and scoring), renders the corresponding
 * `QuizLayout` component and sends the RIASEC scores to the backend.
 *
 * @description
 * - Fetches level 2 questions from the backend on mount.
 * - Uses local state to track the current question index and score per RIASEC type.
 * - Increments or decrements scores depending on user selection ("yes", "no", or "skip").
 * - Displays the current quiz question.
 * - Sends the RIASEC scores to the backend when the quiz is completed.
 *
 * @returns {JSX.Element} A rendered quiz interface with progress tracking and scoring.
 */
const Quiz_L2: React.FC<QuizL2Props> = ({
  previousIds,
  onNextLevel,
  oneLevelBack,
}) => {
  const { apiFetch } = useApiClient();
  const [questions, setQuestions] = useState<
    { text: string; riasec_type: RiasecType }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const [_scores, setScores] =
    useState<Record<RiasecType, number>>(initialScores);

  const [answers, setAnswers] = useState<Record<string, "yes" | "no" | "skip">>(
    {},
  );

  const pointsMap: Record<string, number> = {
    yes: 1,
    no: -1,
    skip: 0,
  };

  const TOTAL_QUESTIONS = questions.length;
  const currentQuestion = questions[currentIndex];

  // Advances to the next question without exceeding the total count.
  const next = () =>
    setCurrentIndex((i) => Math.min(i + 1, TOTAL_QUESTIONS - 1));

  /**
   * Handles  the option to go back one Question.
   * Updates the scores based on the previous selcted answer.
   * Switches Levels if user is on the first Question.
   */
  const goBack = () => {
    if (currentIndex == 0) {
      oneLevelBack();
    } else if (!isTransitioning) {
      setIsTransitioning(true);
      const previousAnswer = answers[currentIndex - 1];
      if (!previousAnswer) {
        setIsTransitioning(false);
        return;
      }
      const lastQuestion = questions[currentIndex - 1];
      const lastType = lastQuestion.riasec_type;

      const points = pointsMap[previousAnswer];

      setScores((prev) => {
        const newScores = { ...prev, [lastType]: prev[lastType] - points };
        return newScores;
      });
      setTimeout(() => {
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
        setIsTransitioning(false);
      }, 300);
    }
  };

  /**
   * Handles the user’s answer selection for the current question.
   * Saves the current selected Option.
   * Updates scores and triggers progression.
   *
   * @param {"yes" | "no" | "skip"} option - The selected answer option.
   */
  const handleSelect = (option: string) => {
    if (!currentQuestion || isTransitioning) return;
    setIsTransitioning(true);

    const currentType = currentQuestion.riasec_type;

    const points = pointsMap[option] ?? 0;
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));

    setScores((prev) => {
      const newScores = { ...prev, [currentType]: prev[currentType] + points };

      // Last question -> send scores to backend
      if (currentIndex === TOTAL_QUESTIONS - 1) {
        void sendData(newScores);
      }
      return newScores;
    });

    // Move to next question
    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS) {
        next();
      }
      setIsTransitioning(false);
    }, 300);
  };

  /**
   * Sends the scores to the backend server.
   * @param scores The RIASEC scores to send.
   */
  const sendData = async (scores: Record<RiasecType, number>) => {
    const transformedScores = convertQuizResponses(scores);
    const scoresArray = scoresToArray(transformedScores);

    try {
      const response = await postFilterLevel(
        {
          level: 2,
          answers: scoresArray,
          studyProgrammeIds: previousIds,
        },
        apiFetch,
      );

      const idsArray = response.ids.map((item: any) => item.studiengang_id);
      onNextLevel(idsArray);
    } catch (err) {
      console.error("Error sending the data: ", err);
      setError({
        title: "Fehler beim Senden",
        message:
          "Der Server konnte die Daten nicht verarbeiten. Bitte versuche es später erneut.",
      });
    }
  };

  /**
   * Fetches level 2 questions from the backend API on component mount.
   * Handles errors and updates the local state with the fetched questions.
   */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuizLevel(2, apiFetch);

        if (!data.questions || data.questions.length === 0) {
          throw new Error("No questions found in the response.");
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

  // In case of an error, display the ErrorScreen component.
  if (error != null) {
    return <ErrorScreen title={error.title} message={error.message} />;
  }

  // While questions are still loading (but no error yet), show a simple loading state.
  if (TOTAL_QUESTIONS === 0) {
    return (
      <QuizLayout currentIndex={0} questionsTotal={0}>
        <div>Lädt...</div>
      </QuizLayout>
    );
  }

  return (
    <div>
      <QuizLayout
        currentIndex={currentIndex + 1}
        questionsTotal={TOTAL_QUESTIONS}
        _oneBack={goBack}
        _showBackButton={true}
      >
        <CardStack currentIndex={currentIndex + 1} totalCards={TOTAL_QUESTIONS}>
          <BaseCard
            cardText={currentQuestion.text}
            sx={{
              height: {
                xs: 280,
                md: 200,
              },
              maxWidth: {
                xs: 250,
                md: 320,
              },
            }}
            cardColor={theme.palette.decorative.green}
          ></BaseCard>
        </CardStack>

        <Stack
          spacing={2}
          sx={{
            mt: 3,
            justifyContent: "center",
            padding: "0 2em",
          }}
        >
          <PrimaryButton
            label={"Ja"}
            onClick={() => handleSelect("yes")}
            ariaText="Antwort Ja"
          />
          <SecondaryButton
            label={"Nein"}
            onClick={() => handleSelect("no")}
            ariaText="Antwort Nein"
          />
          <Typography
            aria-label="Antwort Überspringen"
            onClick={() => handleSelect("skip")}
            sx={{
              fontSize: "0.875rem",
              cursor: "pointer",
              color: theme.palette.text.skipButton,
              textAlign: "center",
              textDecoration: "underline",
              "&:hover": {
                color: theme.palette.text.primary,
              },
            }}
          >
            Überspringen
          </Typography>
        </Stack>

        <Stack
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            zIndex: 10,
            pointerEvents: "none",
            pr: { xs: 10, md: 40, lg: 60 },
            mt: 4,
          }}
        >
          <img
            src="/mascot_walking_pink.svg"
            width={61}
            height={70}
            alt="Mascot"
          />
        </Stack>
      </QuizLayout>
    </div>
  );
};

export default Quiz_L2;
