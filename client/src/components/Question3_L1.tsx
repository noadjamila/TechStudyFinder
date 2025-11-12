/**
 * Question3_L1 Component
 * ----------------------
 * Third quiz question: asks for the user's highest educational qualification.
 *
 * - Displays a dropdown (select menu) with various school degrees.
 * - Requires one option to be selected before proceeding.
 * - Includes optional "Back" navigation button.
 */

import React, { useState } from "react";

interface Props {
    onNext: (answer: string) => void;
    onBack?: () => void;
}

/** List of available school degrees */
const degrees = [
    "Hauptschulabschluss",
    "Realschulabschluss",
    "Fachhochschulreife",
    "Allgemeine Hochschulreife (Abitur)",
    "Bachelor-Abschluss",
    "Master-Abschluss",
    "Anderer Abschluss",
];

const Question3_L1: React.FC<Props> = ({ onNext, onBack }) => {
    // Selected school degree
    const [answer, setAnswer] = useState<string>("");
    // Error message for validation
    const [error, setError] = useState("");

    /** Validate and continue to next question */
    const handleNext = () => {
        if (!answer) return setError("Bitte wähle einen Schulabschluss aus.");
        onNext(answer);
    };

    return (
        <div>
            <h2>Frage 3</h2>
            <p>Was ist dein höchster Schulabschluss?</p>

            {/* Dropdown menu for selecting degree */}
            <select
                value={answer}
                onChange={(e) => {
                    setAnswer(e.target.value);
                    setError("");
                }}
                style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    margin: "12px 0",
                    width: "100%",
                    maxWidth: 300,
                }}
            >
                <option value="">-- Bitte auswählen --</option>
                {degrees.map((d) => (
                    <option key={d} value={d}>
                        {d}
                    </option>
                ))}
            </select>

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

export default Question3_L1;
