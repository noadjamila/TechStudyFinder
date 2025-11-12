/**
 * Question2_L1 Component
 * ----------------------
 * Updated version:
 * Asks the user which degree program they are interested in:
 * "Bachelor", "Master", or "Diploma".
 *
 * - Displays three radio options.
 * - Validates that one option is selected.
 * - Includes optional "Back" navigation.
 */

import React, { useState } from "react";

interface Props {
    onNext: (answer: "Bachelor" | "Master" | "Diploma") => void;
    onBack?: () => void;
}

const Question2_L1: React.FC<Props> = ({ onNext, onBack }) => {
    // User's selected degree type
    const [answer, setAnswer] = useState<"Bachelor" | "Master" | "Diploma" | null>(null);
    // Error message for validation
    const [error, setError] = useState("");

    /** Validate and proceed to the next question */
    const handleNext = () => {
        if (!answer) return setError("Bitte wähle einen Abschluss.");
        onNext(answer);
    };

    return (
        <div>
            <h2>Frage 2</h2>
            <p>Möchtest du einen Bachelor-, Master- oder Diplom-Studiengang machen?</p>

            {/* Degree options */}
            <div style={{ display: "flex", gap: 16, margin: "16px 0" }}>
                <label>
                    <input type="radio" name="q2" onChange={() => setAnswer("Bachelor")} /> Bachelor
                </label>
                <label>
                    <input type="radio" name="q2" onChange={() => setAnswer("Master")} /> Master
                </label>
                <label>
                    <input type="radio" name="q2" onChange={() => setAnswer("Diploma")} /> Diploma
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

export default Question2_L1;
