import React, { useState, useEffect } from "react";
import QuizLayout from "../../layouts/QuizLayout";
import { RiasecType } from "../../types/RiasecTypes";
import ErrorScreen from "../error-screen/ErrorScreen";
import CardStack from "../cards/CardStackLevel2";
import { Stack, Typography } from "@mui/material";
import BaseCard from "../cards/QuizCardBase";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import theme from "../../theme/theme";
import { Answer } from "../../types/QuizAnswer.types";

/**
 * NOTE:
 * This component is intentionally simplified as of now (PR 1).
 * Score calculation and backend submission are reintroduced in PR 2.
 */

export interface QuizL2Props {
  onAnswer: (answer: Answer) => void;
  onComplete: () => void;
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
  onAnswer,
  onComplete,
  oneLevelBack,
}) => {
  const [questions, setQuestions] = useState<
    { text: string; riasec_type: RiasecType }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  /*
   * TODO (PR 2):
   * Local score state will be removed;
   * scores will be derived from AnswerMap
   */
  // const [_scores, setScores] =
  //   useState<Record<RiasecType, number>>(initialScores);
  //
  // const pointsMap: Record<string, number> = {
  //   yes: 1,
  //   no: -1,
  //   skip: 0,
  // };

  const TOTAL_QUESTIONS = questions.length;
  const currentQuestion = questions[currentIndex];

  /**
   * Converts the scores object into an array of type-score pairs.
   *
   * @param {Record<RiasecType, number>} scores - The RIASEC scores.
   * @returns {{ type: RiasecType; score: number }[]} Array of type-score objects.
   */
  // const scoresToArray = (
  //   scores: Record<RiasecType, number>,
  // ): { type: RiasecType; score: number }[] => {
  //   return Object.entries(scores).map(([type, score]) => ({
  //     type: type as RiasecType,
  //     score,
  //   }));
  // };

  /**
   * Handles the option to go back one Question.
   * Switches Levels if user is on the first Question.
   */
  const goBack = () => {
    if (currentIndex === 0) {
      oneLevelBack();
    } else {
      setCurrentIndex((i) => Math.max(i - 1, 0));
    }
  };

  /**
   * Handles the user’s answer selection for the current question.
   * Saves the current selected Option.
   * Updates scores and triggers progression.
   *
   * @param {"yes" | "no" | "skip"} option - The selected answer option.
   */
  const handleSelect = (option: "yes" | "no" | "skip") => {
    if (!currentQuestion || isTransitioning) return;
    setIsTransitioning(true);
    onAnswer({
      questionId: `level2.question${currentIndex}`,
      value: option,
      answeredAt: Date.now(),
    });

    // Last question -> send scores to backend
    setTimeout(() => {
      if (currentIndex === TOTAL_QUESTIONS - 1) {
        onComplete();
      } else {
        setCurrentIndex((i) => i + 1);
      }
      setIsTransitioning(false);
    }, 300);
  };

  /*
   * TODO (PR 2):
   * Send RIASEC scores to backend once score calculation
   * is implemented based on AnswerMap
   */
  // const sendData = async (scores: { type: RiasecType; score: number }[]) => {
  //   try {
  //     const response = await postFilterLevel({
  //       level: 2,
  //       answers: scores,
  //       studyProgrammeIds: previousIds,
  //     });
  //
  //     const idsArray = response.ids.map((item: any) => item.studiengang_id);
  //     console.log("IDs as strings:", idsArray);
  //   } catch (err) {
  //     console.error("Error sending the data: ", err);
  //     setError({
  //       title: "Fehler beim Senden",
  //       message:
  //         "Der Server konnte die Daten nicht verarbeiten. Bitte versuche es später erneut.",
  //     });
  //   }
  // };

  /**
   * Fetches level 2 questions from the backend API on component mount.
   * Handles errors and updates the local state with the fetched questions.
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
