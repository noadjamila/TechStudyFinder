/**
 * QuestionStart Component
 * This component represents the very first question of the flow.
 * It asks the user about their current study intention (starting to study,
 * continuing studies, or simply exploring). The user's selection is validated
 * and then passed to the parent component.
 *
 * Responsibilities:
 * - Displays three radio options for the user's starting situation.
 * - Validates that the user has selected an option before proceeding.
 * - Shows an error message if the user attempts to continue without choosing.
 * - Passes the selected answer back to the parent via the `onNext` callback.
 *
 * Props:
 * - onNext(answer: string):
 *     A callback function executed after the user selects a valid option.
 *     The parent handles the flow transition (e.g., moving to the fireworks page).
 *
 * State:
 * - answer: Stores the user's selected option ("anfangen", "weiterstudieren", "umschauen").
 * - error: Stores a validation message shown when no option is selected.
 *
 * Behavior:
 * - If the user clicks "Weiter" without selecting an answer, an error message appears.
 * - If an answer is selected, the component triggers `onNext(answer)` and does not
 *   handle any further navigation logic itself.
 *
 * Styling:
 * - Uses a clean, card-based layout defined in QuestionStart.module.css.
 * - Matches the corporate design shared across the project.
 */
import React, { useState } from "react";
import styles from "./QuestionStart.module.css";

interface Props {
    onNext: (answer: string) => void;
}

const QuestionStart: React.FC<Props> = ({ onNext }) => {
    const [answer, setAnswer] = useState<string>("");
    const [error, setError] = useState("");

    const handleNext = () => {
        if (!answer) {
            setError("Bitte wähle eine Antwort aus.");
            return;
        }
        onNext(answer);
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.question}>
                Fängst du an zu studieren oder willst du weiter studieren?
            </h2>

            <div className={styles.options}>
                <label>
                    <input
                        type="radio"
                        name="startquestion"
                        onChange={() => setAnswer("anfangen")}
                    />
                    Ich fange an zu studieren
                </label>

                <label>
                    <input
                        type="radio"
                        name="startquestion"
                        onChange={() => setAnswer("weiterstudieren")}
                    />
                    Ich will weiter studieren
                </label>

                <label>
                    <input
                        type="radio"
                        name="startquestion"
                        onChange={() => setAnswer("umschauen")}
                    />
                    Ich möchte mich einfach umschauen
                </label>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.button} onClick={handleNext}>
                Weiter
            </button>
        </div>
    );
};

export default QuestionStart;
