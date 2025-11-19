// components/QuizPage.tsx
import React, { useState } from "react";
import QuestionStart from "../components/QuestionStart";
import Fireworks from "../components/Fireworks";
const QuizPage: React.FC = () => {
    const [screen, setScreen] = useState<"start" | "fireworks">("start");

    return (
        <div>
            {screen === "start" && (
                <QuestionStart
                    onNext={() => {
                        setScreen("fireworks"); // Navigate to fireworks after answer
                    }}
                />
            )}

            {screen === "fireworks" && (
                <Fireworks
                    onContinue={() => console.log("Next")}
                />
            )}
        </div>
    );
};

export default QuizPage;
