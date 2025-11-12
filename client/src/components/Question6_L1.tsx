/**
 * Question6_L1 Component
 * ----------------------
 * Sixth quiz question: asks whether the user wants to pursue a dual study program.
 *
 * - Displays a question with two radio buttons: "Ja" (Yes) and "Nein" (No).
 * - Provides additional information about the dual study program via a small info text.
 *   (In the UI, this is represented as a small note explaining that a dual program combines study and practical experience in a company.)
 * - Requires one option to be selected before proceeding.
 * - Includes optional "Back" navigation button.
 */

import React, { useState } from "react";

interface Props {
    onNext: (answer: "Ja" | "Nein") => void;
    onBack?: () => void;
}

const Question6_L1: React.FC<Props> = ({ onNext, onBack }) => {
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
            <h2>Frage 6</h2>
            <p>Möchtest du dual studieren?</p>
            {/* Info text about dual study program */}
            <small style={{ color: "#555" }}>
                Ein duales Studium kombiniert Studium und Praxiserfahrung im Unternehmen.
            </small>

            {/* Radio buttons for selecting answer */}
            <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
                <label>
                    <input type="radio" name="q6" onChange={() => setAnswer("Ja")} /> Ja
                </label>
                <label>
                    <input type="radio" name="q6" onChange={() => setAnswer("Nein")} /> Nein
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

export default Question6_L1;
