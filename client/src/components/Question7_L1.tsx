/**
 * Question7_L1 Component
 * ----------------------
 * Seventh quiz question: asks whether the user prefers an application-oriented or theory-oriented study approach.
 *
 * - Displays two radio buttons for the options: "Anwendungsorientiert" and "Theorieorientiert".
 * - Requires one option to be selected before proceeding.
 * - Includes optional "Back" navigation button.
 * - The "Next" button is labeled as "Fertig".
 */

import React, { useState } from "react";

interface Props {
    onNext: (answer: "Anwendungsorientiert" | "Theorieorientiert") => void;
    onBack?: () => void;
}

/** Options for study approach */
const options = ["Anwendungsorientiert", "Theorieorientiert"];

const Question7_L1: React.FC<Props> = ({ onNext, onBack }) => {
    // Selected study preference
    const [answer, setAnswer] = useState<"Anwendungsorientiert" | "Theorieorientiert" | null>(null);
    // Error message for validation
    const [error, setError] = useState("");

    /** Validate and continue to next question */
    const handleNext = () => {
        if (!answer) return setError("Bitte wähle eine Antwort.");
        onNext(answer);
    };

    return (
        <div>
            <h2>Frage 7</h2>
            <p>Möchtest du anwendungsorientiert studieren, oder lieber mit mehr Theorie?</p>

            {/* Radio buttons for selecting study preference */}
            <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
                {options.map((opt) => (
                    <label key={opt}>
                        <input
                            type="radio"
                            name="q7"
                            onChange={() => setAnswer(opt as "Anwendungsorientiert" | "Theorieorientiert")}
                        />
                        {opt}
                    </label>
                ))}
            </div>

            {/* Error message */}
            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

            {/* Navigation buttons */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {onBack && <button onClick={onBack}>Zurück</button>}
                <button onClick={handleNext}>Fertig</button>
            </div>
        </div>
    );
};

export default Question7_L1;
