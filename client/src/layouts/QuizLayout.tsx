import React from "react";
import styles from "./QuizLayout.module.css";
import Progressbar from "../components/quiz/Progressbar";
import Zurueck_Button from "../components/buttons/Zurueck_Button";

/**
 * Props of {@link QuizLayout}.
 * Allows parent-components the interaction and modification of this component.
 */
export interface QuizLayoutProps {
  /**
   * The index of the current progress, used by the progressbar.
   */
  currentIndex: number;

  /**
   * Total number of all questions/steps, used by the progressbar.
   */
  questionsTotal: number;

  /**
   * Main content (react components) which is placed within the layout.
   */
  children: React.ReactNode;

  oneBack?: () => void;

  showBackButton?: boolean;
}

/**
 * The `QuizLayout` is the base layout for all quizpages.
 * It shows a progressbar und renders the embedded component (e.g. a quiz question).
 *
 * @example
 * <QuizLayout currentIndex={2} questionsTotal={10}>
 *   <Question />
 * </QuizLayout>
 *
 * @param {Object} props - Props of the layout.
 * @returns {JSX.Element} The rendered quiz-layout with progressbar and content component.
 */
const QuizLayout: React.FC<QuizLayoutProps> = ({
  currentIndex,
  questionsTotal,
  children,
  oneBack,
  showBackButton = true,
}: QuizLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.topArea}>
          {showBackButton && (
            <Zurueck_Button label="Zurück" onClick={oneBack} sx={{}} />
          )}
          <Progressbar current={currentIndex} total={questionsTotal} />
        </div>
        <main className={styles.middle}>{children}</main>
      </div>
    </div>
  );
};

export default QuizLayout;
