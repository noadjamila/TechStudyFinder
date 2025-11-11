import React from "react";

interface QuizLayoutProps {
    children: React.ReactNode;
}

const QuizLayout_L1: React.FC<QuizLayoutProps> = ({ children }) => (
    <div style={{ maxWidth: 720, margin: "32px auto", padding: 20 }}>
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                padding: 24,
            }}
        >
            {children}
        </div>
    </div>
);

export default QuizLayout_L1;
