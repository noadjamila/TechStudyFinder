import React, { useState } from "react";
import QuizLayout from "../../layouts/QuizLayout";
import CardStack from "../cards/CardStackLevel2";
import { Stack, Typography } from "@mui/material";
import BaseCard from "../cards/QuizCardBase";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import theme from "../../theme/theme";
import { Answer } from "../../types/QuizAnswer.types";
import { QuizSession } from "../../types/QuizSession";
import { createQuizSession } from "../../session/createQuizSession";
import { fetchQuestions } from "../../api/quizApi";
import ErrorScreen from "../error-screen/ErrorScreen";

export interface QuizL2Props {
  session: QuizSession;
  onAnswer: (answer: Answer) => void;
  onComplete: () => void;
  oneLevelBack: () => void;
  onQuestionBack: () => void;
  onQuestionNext: () => void;
}

/**
 * Level 2 quiz flow component.
 *
 * Renders a card-based question flow. Tracks the current question index,
 * handles forward/back navigation (including returning to the previous level),
 * and emits answers and completion events to the parent.
 *
 * @param {QuizL2Props} props Component callbacks for answering, completion, and back navigation.
 * @returns {JSX.Element} The rendered quiz UI or a loading state while questions are fetched.
 */
const Quiz_L2: React.FC<QuizL2Props> = ({
  session,
  onAnswer,
  onComplete,
  oneLevelBack,
  onQuestionBack,
  onQuestionNext,
}) => {
  const questions = session.level2Questions ?? [];

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const TOTAL_QUESTIONS = questions.length;
  const currentQuestion = questions[session.currentQuestionIndex];

  /**
   * Handles the option to go back one Question.
   * Switches Levels if user is on the first Question.
   */
  const goBack = () => {
    if (session.currentQuestionIndex === 0) {
      oneLevelBack();
    } else {
      onQuestionBack();
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
      questionId: `level2.question${session.currentQuestionIndex}.${currentQuestion.riasec_type}`,
      value: option,
      answeredAt: Date.now(),
    });

    // Last question: send scores to backend
    setTimeout(() => {
      if (session.currentQuestionIndex === TOTAL_QUESTIONS - 1) {
        onComplete();
      } else {
        onQuestionNext();
      }
      setIsTransitioning(false);
    }, 300);
  };
  // While questions are still loading (but no error yet), show a simple loading state
  if (TOTAL_QUESTIONS === 0) {
    return (
      <QuizLayout currentIndex={0} questionsTotal={0}>
        <div>Lädt...</div>
      </QuizLayout>
    );
  }
  if (!currentQuestion) {
    return (
      <ErrorScreen
        title="Frage nicht gefunden"
        message="Bitte lade die Seite neu."
      />
    );
  }

  return (
    <div>
      <QuizLayout
        currentIndex={session.currentQuestionIndex + 1}
        questionsTotal={TOTAL_QUESTIONS}
        _oneBack={goBack}
        _showBackButton={true}
      >
        <CardStack
          currentIndex={session.currentQuestionIndex + 1}
          totalCards={TOTAL_QUESTIONS}
        >
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
