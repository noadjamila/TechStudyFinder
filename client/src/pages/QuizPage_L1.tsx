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

type Level1Answer = {
    q1?: { answer: "Ja" | "Nein"; cities: string[] };
    q2?: "Ja" | "Nein";
    q3?: "Ja" | "Nein";
    q4?: "Ja" | "Nein";
    q5?: "Ja" | "Nein";
    q6?: "Ja" | "Nein";
    q7?: "Anwendungsorientiert" | "Theorieorientiert";
};

const TOTAL = 7;

const QuizPage_L1: React.FC = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Level1Answer>({});
    const [serverResponse, setServerResponse] = useState<any | null>(null);

    const next = () => setStep((s) => Math.min(TOTAL, s + 1));
    const back = () => setStep((s) => Math.max(0, s - 1));

    const save = (data: Partial<Level1Answer>) => setAnswers((prev) => ({ ...prev, ...data }));

    const sendData = async (payload: Level1Answer) => {
        console.log("Send Level-1-Payload:", payload);
        setServerResponse({ ok: true, payload }); // stub
    };

    const finish = (data: Partial<Level1Answer>) => {
        const all = { ...answers, ...data };
        setAnswers(all);
        setStep(TOTAL);
        sendData(all);
    };

    return (
        <QuizLayout_L1>
            <Progressbar_L1 current={Math.min(step + 1, TOTAL)} total={TOTAL} />

            {step === 0 && <Question1_L1 onNext={(d) => { save({ q1: d }); next(); }} />}
            {step === 1 && <Question2_L1 onNext={(a) => { save({ q2: a }); next(); }} onBack={back} />}
            {step === 2 && <Question3_L1 onNext={(a) => { save({ q3: a }); next(); }} onBack={back} />}
            {step === 3 && <Question4_L1 onNext={(a) => { save({ q4: a }); next(); }} onBack={back} />}
            {step === 4 && <Question5_L1 onNext={(a) => { save({ q5: a }); next(); }} onBack={back} />}
            {step === 5 && <Question6_L1 onNext={(a) => { save({ q6: a }); next(); }} onBack={back} />}
            {step === 6 && <Question7_L1 onNext={(a) => finish({ q7: a })} onBack={back} />}

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
