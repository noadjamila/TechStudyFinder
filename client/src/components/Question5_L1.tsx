import React, { useState } from "react";

interface Props {
    onNext: (answer: "Ja" | "Nein") => void;
    onBack?: () => void;
}

const Question5_L1: React.FC<Props> = ({ onNext, onBack }) => {
    const [answer, setAnswer] = useState<"Ja" | "Nein" | null>(null);
    const [error, setError] = useState("");

    const handleNext = () => {
        if (!answer) return setError("Bitte wähle eine Antwort.");
        onNext(answer);
    };

    return (
        <div>
            <h2>Frage 5</h2>
            <p>Möchtest du auf Englisch studieren?</p>

            <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
                <label>
                    <input type="radio" name="q5" onChange={() => setAnswer("Ja")} /> Ja
                </label>
                <label>
                    <input type="radio" name="q5" onChange={() => setAnswer("Nein")} /> Nein
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

export default Question5_L1;
