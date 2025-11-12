/**
 * Question4_L1 Component
 * ----------------------
 * Fourth quiz question: asks whether the user wants to study in an international program.
 *
 * - Displays a question with two radio buttons: "Ja" (Yes) and "Nein" (No).
 * - Requires one option to be selected before proceeding.
 * - Provides a brief explanation about what an international program entails.
 * - Includes optional "Back" navigation button.
 */

import React, { useState } from "react";

interface Props {
    onNext: (answer: "Ja" | "Nein") => void;
    onBack?: () => void;
}

const Question4_L1: React.FC<Props> = ({ onNext, onBack }) => {
    // Selected answer: "Ja" or "Nein"
    const [answer, setAnswer] = useState<"Ja" | "Nein" | null>(null);
    // Error message for validation
    const [error, setError] = useState("");

    /** Validate and continue to next question */
    const handleNext = () => {
        if (!answer) return setError("Bitte wähle eine Antwort.");
        onNext(answer);
    };

    return (
        <div>
            <h2>Frage 4</h2>
            <p>Möchtest du in einem internationalen Studiengang studieren?</p>
            <small style={{ color: "#555" }}>
                Ein internationaler Studiengang bedeutet z. B. Mehrsprachigkeit und internationale Ausrichtung.
            </small>

            {/* Radio buttons for selecting answer */}
            <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
                <label>
                    <input type="radio" name="q4" onChange={() => setAnswer("Ja")} /> Ja
                </label>
                <label>
                    <input type="radio" name="q4" onChange={() => setAnswer("Nein")} /> Nein
                </label>
            </div>

            {/* Error message */}
            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

            {/* Navigation buttons */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {onBack && <button onClick={onBack}>Zurück</button>}
                <button onClick={handleNext}>Weiter</button>
            </div>
        </div>
    );
};

export default Question4_L1;
