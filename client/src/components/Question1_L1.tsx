import React, { useState } from "react";

interface Props {
    onNext: (data: { answer: "Ja" | "Nein"; cities: string[] }) => void;
}

const cities = ["Berlin", "Hamburg", "München", "Köln"];

const Question1_L1: React.FC<Props> = ({ onNext }) => {
    const [answer, setAnswer] = useState<"Ja" | "Nein" | null>(null);
    const [selected, setSelected] = useState<string[]>([]);
    const [error, setError] = useState("");

    const toggleCity = (c: string) =>
        setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

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
            <div style={{ display: "flex", gap: 12, margin: "12px 0" }}>
                <label><input type="radio" name="q1" onChange={() => setAnswer("Ja")} /> Ja</label>
                <label><input type="radio" name="q1" onChange={() => setAnswer("Nein")} /> Nein</label>
            </div>

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

            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
            <button onClick={handleNext}>Weiter</button>
        </div>
    );
};

export default Question1_L1;
