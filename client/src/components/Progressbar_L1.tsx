import React from "react";

interface ProgressbarProps {
    current: number;
    total: number;
}

const Progressbar_L1: React.FC<ProgressbarProps> = ({ current, total }) => {
    const safeCurrent = Math.max(0, Math.min(current, total));
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
                    style={{
                        height: "100%",
                        width: `${percent}%`,
                        background: "#10b981",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>
            <div style={{ fontSize: 14, color: "#444", marginTop: 6 }}>
                Frage {safeCurrent} von {total}
            </div>
        </div>
    );
};

export default Progressbar_L1;
