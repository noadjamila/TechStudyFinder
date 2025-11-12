/**
 * QuizPage_L1
 * ------------
 * Main page for Level 1 of the quiz.
 * Controls the flow between questions, saves user answers,
 * displays progress, and sends results when finished.
 */

import React, { useState } from "react";
import QuizLayout_L1 from "../layouts/QuizLayout_L1";
import Progressbar_L1 from "../components/Progressbar_L1";
import Question1_L1 from "../components/Question1_L1";
import Question2_L1 from "../components/Question2_L1";
import Question3_L1 from "../components/Question3_L1";
import Question4_L1 from "../components/Question4_L1";
import Question5_L1 from "../components/Question5_L1";
import Question6_L1 from "../components/Question6_L1";
import Question7_L1 from "../components/Question7_L1";

/**
 * Type definition for all stored quiz answers.
 * Each property corresponds to one question.
 */
type Level1Answer = {
    q1?: { answer: "Ja" | "Nein"; cities: string[] };
    q2?: "Bachelor" | "Master" | "Diploma";
    q3?: string; // ✅ Updated: stores highest school degree as string
    q4?: "Ja" | "Nein";
    q5?: "Ja" | "Nein";
    q6?: "Ja" | "Nein";
    q7?: "Anwendungsorientiert" | "Theorieorientiert";
};

/** Total number of questions in Level 1 */
const TOTAL = 7;

const QuizPage_L1: React.FC = () => {
    /** Tracks current question step (0–6) */
    const [step, setStep] = useState(0);
    /** Stores all answers as user progresses */
    const [answers, setAnswers] = useState<Level1Answer>({});
    /** Simulated server response after submission */
    const [serverResponse, setServerResponse] = useState<any | null>(null);

    /** Move to the next question */
    const next = () => setStep((s) => Math.min(TOTAL, s + 1));

    /** Move back to the previous question */
    const back = () => setStep((s) => Math.max(0, s - 1));

    /** Save partial answer data */
    const save = (data: Partial<Level1Answer>) =>
        setAnswers((prev) => ({ ...prev, ...data }));

    /** Simulate sending data to a backend */
    const sendData = async (payload: Level1Answer) => {
        console.log("Send Level-1-Payload:", payload);
        setServerResponse({ ok: true, payload }); // stubbed response
    };

    /** Save final data and send to backend */
    const finish = (data: Partial<Level1Answer>) => {
        const all = { ...answers, ...data };
        setAnswers(all);
        setStep(TOTAL);
        sendData(all);
    };

    return (
        <QuizLayout_L1>
            {/* Progress bar showing quiz progress */}
            <Progressbar_L1 current={Math.min(step + 1, TOTAL)} total={TOTAL} />

            {/* Render question components by step */}
            {step === 0 && <Question1_L1 onNext={(d) => { save({ q1: d }); next(); }} />}
            {step === 1 && <Question2_L1 onNext={(a) => { save({ q2: a }); next(); }} onBack={back} />}
            {step === 2 && <Question3_L1 onNext={(a) => { save({ q3: a }); next(); }} onBack={back} />}
            {step === 3 && <Question4_L1 onNext={(a) => { save({ q4: a }); next(); }} onBack={back} />}
            {step === 4 && <Question5_L1 onNext={(a) => { save({ q5: a }); next(); }} onBack={back} />}
            {step === 5 && <Question6_L1 onNext={(a) => { save({ q6: a }); next(); }} onBack={back} />}
            {step === 6 && <Question7_L1 onNext={(a) => finish({ q7: a })} onBack={back} />}

            {/* Debug view showing results and mock server response */}
            {step >= TOTAL && (
                <div>
                    <h2>Ergebnisse (Debug)</h2>
                    <pre style={{ background: "#f7f7f7", padding: 12 }}>
                        {JSON.stringify(answers, null, 2)}
                    </pre>

                    {serverResponse && (
                        <>
                            <h3>Server-Antwort</h3>
                            <pre style={{ background: "#f7f7f7", padding: 12 }}>
                                {JSON.stringify(serverResponse, null, 2)}
                            </pre>
                        </>
                    )}
                </div>
            )}
        </QuizLayout_L1>
    );
};

export default QuizPage_L1;
