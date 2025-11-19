/**
 * Fireworks Component
 * This component displays a celebratory screen after the user completes
 * the initial question in the start flow. It shows a confetti animation
 * for a short period of time and provides a button to continue to the next
 * step of the quiz.
 *
 * Features:
 * - Displays an animated confetti effect using the 'react-confetti' library.
 * - Automatically hides the confetti animation after 10 seconds.
 * - Shows a congratulatory message to the user.
 * - Includes a "Continue" button that triggers navigation to the next page.
 *
 * Props:
 * - onContinue: A callback function executed when the user clicks the
 *   "Continue" button. The parent component typically navigates to the
 *   next quiz level or another screen.
 *
 * Behavior:
 * - When the component mounts, a timer starts to disable the confetti
 *   after 10 seconds.
 * - The timer is cleared automatically when the component unmounts.
 *
 * Styling:
 * - Uses a card-like layout styled via Fireworks.module.css.
 * - The page visually matches the corporate/clean card design used in
 *   other parts of the application.
 */
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import styles from "./Fireworks.module.css";

interface Props {
    onContinue: () => void;
}

const Fireworks: React.FC<Props> = ({ onContinue }) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.card}>
            {showConfetti && <Confetti numberOfPieces={250} recycle={false} />}

            <h2 className={styles.text}>
                🎉 Glückwunsch! <br />
                Sie können jetzt mit dem Test fortfahren.
            </h2>

            <button className={styles.button} onClick={onContinue}>
                Weiter
            </button>
        </div>
    );
};

export default Fireworks;
