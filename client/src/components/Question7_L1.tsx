import React, { useState } from "react";

interface Props {
    onNext: (answer: "Anwendungsorientiert" | "Theorieorientiert") => void;
    onBack?: () => void;
}

const Question7_L1: React.FC<Props> = ({ onNext, onBack }) => {
    const [answer, setAnswer] = useState<"Anwendungsorientiert" | "Theorieorientiert" | null>(null);
    const [error, setError] = useState("");

    const handleNext = () => {
        if (!answer) return setError("Bitte wähle eine Antwort.");
        onNext(answer);
    };

    return (
        <div>
            <h2>Frage 7</h2>
            <p>Möchtest du anwendungsorientiert studieren, oder lieber mit mehr Theorie?</p>

            <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
                <label>
                    <input type="radio" name="q7" onChange={() => setAnswer("Anwendungsorientiert")} />
                    Anwendungsorientiert
                </label>
                <label>
                    <input type="radio" name="q7" onChange={() => setAnswer("Theorieorientiert")} />
                    Theorieorientiert
                </label>
            </div>

            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {onBack && <button onClick={onBack}>Zurück</button>}
                <button onClick={handleNext}>Fertig</button>
            </div>
        </div>
    );
};

export default Question7_L1;
