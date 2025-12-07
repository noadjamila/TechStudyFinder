import React, { useState } from "react";
import styles from "./QuizCard_L2.module.css";

/**
 * Props for {@link QuizCard_L2}
 * Allows parent-components the interaction and modification of this component.
 */
export interface QuizCardProps {
  /**
   * Current question that should be displayed.
   */
  question: string;

  /**
   * Callback function that is called when the user selects an answer.
   *
   * @param option - Key of the selected option ("yes", "no" or "skip").
   * @returns void
   *
   */

  onSelect: (option: string) => void;
}

/**
 * This component displays a question with three answer options ("yes", "no", "skip").
 * The user can select an option, whereupon a short animation is played
 * before the result is passed to the parent component.
 *
 * @example
 * ```tsx
 * <QuizCard_L2
 *   question="..."
 *   onSelect={(answer) => handleSelect(answer)}
 * />
 * ```
 *
 * @param props - Props for the component.
 * @returns {JSX.Element} Interactive quiz card with three answer options.
 */
const QuizCard_L2: React.FC<QuizCardProps> = ({ question, onSelect }) => {
  const [selection, setSelection] = useState("");
  const [animation, setAnimation] = useState(false);

  /**
   * Deals with the selection of an answer option.
   *
   * - Activates a short animation of the radio button
   * - Calls the `onSelect` callback function after a delay of 800ms
   *
   * @param optKey - The key of the selected option
   */
  const handleSelect = (optKey: string) => {
    setSelection(optKey);
    setAnimation(true);

    setTimeout(() => {
      setAnimation(false);
      onSelect(optKey);
    }, 800);
  };

  const options = [
    { key: "yes", value: "Ja" },
    { key: "no", value: "Nein" },
    { key: "skip", value: "Überspringen" },
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.question}>{question}</h2>
      {options.map((opt) => (
        <label key={opt.key} className={styles.option}>
          <input
            type="radio"
            name="selection"
            value={opt.key}
            checked={selection === opt.key}
            onChange={() => handleSelect(opt.key)}
          />
          <span
            className={`${styles.radiobutton} ${
              selection === opt.key ? styles.active : ""
            } ${selection === opt.key && animation ? styles.puls : ""}`}
          ></span>
          <span>{opt.value}</span>
        </label>
      ))}
    </div>
  );
};

export default QuizCard_L2;
