import React, { useState } from "react";

interface Props {
    onNext: (answer: "Ja" | "Nein") => void;
    onBack?: () => void;
}

const Question6_L1: React.FC<Props> = ({ onNext, onBack }) => {
    const [answer, setAnswer] = useState<"Ja" | "Nein" | null>(null);
    const [error, setError] = useState("");

    const handleNext = () => {
        if (!answer) return setError("Bitte wähle eine Antwort.");
        onNext(answer);
    };

    return (
        <div>
            <h2>Frage 6</h2>
            <p>Möchtest du dual studieren?</p>
            <small style={{ color: "#555" }}>
                Ein duales Studium kombiniert Studium und Praxiserfahrung im Unternehmen.
            </small>

            <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
                <label>
                    <input type="radio" name="q6" onChange={() => setAnswer("Ja")} /> Ja
                </label>
                <label>
                    <input type="radio" name="q6" onChange={() => setAnswer("Nein")} /> Nein
                </label>
            </div>

            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {onBack && <button onClick={onBack}>Zurück</button>}
                <button onClick={handleNext}>Weiter</button>
            </div>
        </div>
    );
};

export default Question6_L1;
