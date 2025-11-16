/**
 * StartFlowPage Component
 * This component represents the first step of the quiz flow.
 * It displays the initial question ("QuestionStart") and sends the user's
 * selected answer to the backend before moving to the next screen.
 *
 * Responsibilities:
 * - Renders the starting question via the QuestionStart component.
 * - Sends the selected start type (e.g., "anfangen", "weiterstudieren", "umschauen")
 *   to the backend API endpoint `/api/quiz/start`.
 * - Triggers the `onNext` callback after the answer is submitted,
 *   which transitions the UI to the FireworksPage.
 *
 * Props:
 * - onNext: A callback function that is executed after the user completes
 *   the start question. The parent component decides what happens next
 *   (e.g., navigating to the fireworks animation screen).
 *
 * Backend Interaction:
 * - Sends a POST request to:
 *     http://localhost:5001/api/quiz/start
 * - Request payload:
 *     { startType: string }
 * - Logs the backend response for debugging purposes.
 *
 * Notes:
 * - Only the UI flow and backend communication are handled here.
 * - No styling or layout logic is included in this component.
 */
import React from "react";
import QuestionStart from "../components/QuestionStart";

interface Props {
    onNext: () => void;
}

const StartFlowPage: React.FC<Props> = ({ onNext }) => {
    const sendToBackend = async (answer: string) => {
        try {
            const res = await fetch("http://localhost:5001/api/quiz/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startType: answer }),
            });
            const result = await res.json();
            console.log("Backend Antwort:", result);
        } catch (err) {
            console.error("Fehler beim Senden:", err);
        }
    };

    return (
        <QuestionStart
            onNext={(answer) => {
                sendToBackend(answer);
                onNext();
            }}
        />
    );
};

export default StartFlowPage;
