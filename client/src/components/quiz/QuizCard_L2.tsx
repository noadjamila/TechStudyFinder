import React, { useState, useEffect } from "react";
import styles from "./QuizCard_L2.module.css";

export interface QuizCardProps {
  question: string;
  onSelect: (option: string) => void;
}

const QuizCard_L2: React.FC<QuizCardProps> = ({ question, onSelect }) => {
  const [selection, setSelection] = useState("");
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setSelection("");
    setAnimation(false);
  }, [question]);

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
