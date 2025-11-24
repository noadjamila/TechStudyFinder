import React from "react";

export interface QuizOption<T = string> {
  label: string;
  value: T; // z. B. "grundständig" oder { type: "R" }
  description?: string;
}

export interface QuizCardBaseProps<T = string> {
  title?: string;
  question: string;
  options: QuizOption<T>[];
  selected?: T;
  onSelect: (value: T) => void;
}

const QuizCardBase = <T,>({
  title,
  question,
  options,
  selected,
  onSelect,
}: QuizCardBaseProps<T>) => {
  return (
    <div className="card">
      {title && <h2>{title}</h2>}
      <p>{question}</p>
      <div className="options">
        {options.map((o) => (
          <button
            key={String(o.value)}
            aria-pressed={selected === o.value}
            onClick={() => onSelect(o.value)}
            className={selected === o.value ? "active" : ""}
            title={o.description}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCardBase;
