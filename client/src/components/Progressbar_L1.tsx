/**
 * Progressbar_L1 Component
 * -------------------------
 * A reusable progress bar component for visualizing quiz/questionnaire progress.
 * It displays both a graphical progress indicator and a textual label (e.g., "Frage 2 von 3").
 *
 * Props:
 *  - current (number): The current step or question number.
 *  - total (number): The total number of steps or questions.
 *
 * Features:
 *  - Ensures current progress value never exceeds the total.
 *  - Smooth animation when progress changes.
 *  - Simple inline styling for ease of integration.
 */
import React from "react";
/**
 * Type definition for component props.
 * current: current step number.
 * total: total number of steps.
 */
interface ProgressbarProps {
    current: number;
    total: number;
}
/**
 * Functional React component rendering a progress bar with label.
 */
const Progressbar_L1: React.FC<ProgressbarProps> = ({ current, total }) => {
    /**
     * Ensure the current value is always within the valid range [0, total].
     * Example:
     *  - If current < 0 → becomes 0
     *  - If current > total → becomes total
     */
    const safeCurrent = Math.max(0, Math.min(current, total));
    /**
     * Calculate completion percentage for the bar width.
     * If total = 0, avoid division by zero and set percent = 0.
     */
    const percent = total > 0 ? (safeCurrent / total) * 100 : 0;

    return (
        <div style={{ width: "100%", margin: "0.5rem 0 1rem" }}>
            <div
                style={{
                    height: 10,
                    background: "#e6f4ef",
                    borderRadius: 999,
                    overflow: "hidden",
                }}
            >
                <div
                    role="progressbar"
                    aria-valuenow={safeCurrent}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    style={{
                        height: "100%",
                        width: `${percent}%`,
                        background: "#10b981",
                        transition: "width 0.3s ease",
                    }}
                />

            </div>
            <div style={{fontSize: 14, color: "#444", marginTop: 6}}>
                Frage {safeCurrent} von {total}
            </div>
        </div>
    );
};

export default Progressbar_L1;
