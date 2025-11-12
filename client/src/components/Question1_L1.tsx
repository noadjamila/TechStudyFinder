/**
 * Question1_L1 Component
 * ----------------------
 * First quiz question: asks if the user has a preferred study location.
 * - If "Yes", a list of cities appears for multiple selection.
 * - If "No", moves directly to the next question.
 */
import React, { useState } from "react";

interface Props {
    onNext: (data: { answer: "Ja" | "Nein"; cities: string[] }) => void;
}
/** List of selectable cities */
const cities = ["Berlin", "Hamburg", "München", "Köln"];

const Question1_L1: React.FC<Props> = ({ onNext }) => {
    // Stores user's answer ("Ja" or "Nein")
    const [answer, setAnswer] = useState<"Ja" | "Nein" | null>(null);
    // Stores selected cities (only used when answer === "Ja")
    const [selected, setSelected] = useState<string[]>([]);
    // Error message for validation feedback
    const [error, setError] = useState("");

    /** Add/remove a city from the selection list */
    const toggleCity = (c: string) =>
        setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

    /** Validate and send answer data to parent component */
    const handleNext = () => {
        if (!answer) return setError("Bitte wähle eine Antwort.");
        if (answer === "Ja" && selected.length === 0)
            return setError("Wenn 'Ja', bitte mindestens eine Stadt wählen.");
        onNext({ answer, cities: selected });
    };

    return (
        <div>
            <h2>Frage 1</h2>
            <p>Hast du einen bestimmten Wunsch für deinen Studienort?</p>
            {/* Answer options */}
            <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
                <label><input type="radio" name="q1" onChange={() => setAnswer("Ja")} /> Ja</label>
                <label><input type="radio" name="q1" onChange={() => setAnswer("Nein")} /> Nein</label>
            </div>

            {/* City selection (visible only if answer === "Ja") */}
            {answer === "Ja" && (
                <div style={{ marginBottom: 12 }}>
                    <p>Bitte wähle eine oder mehrere Städte:</p>
                    {cities.map((c) => (
                        <label key={c} style={{ marginRight: 10 }}>
                            <input type="checkbox" checked={selected.includes(c)} onChange={() => toggleCity(c)} /> {c}
                        </label>
                    ))}
                </div>
            )}

            {/* Validation message */}
            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
            <button onClick={handleNext}>Weiter</button>
        </div>
    );
};

export default Question1_L1;
