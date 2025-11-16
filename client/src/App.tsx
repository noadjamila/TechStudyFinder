import React, { useState } from "react";
import StartFlowPage from "./pages/StartFlowPage";
import FireworksPage from "./pages/FireworksPage";

const App: React.FC = () => {
    const [screen, setScreen] = useState<"start" | "fireworks">("start");

    return (
        <div style={{ background: "#f0f4f6", minHeight: "100vh", padding: 24 }}>
            {screen === "start" && (
                <StartFlowPage onNext={() => setScreen("fireworks")} />
            )}
            {screen === "fireworks" && (
                <FireworksPage onContinue={() => console.log("Weiter zum Test")} />
            )}
        </div>
    );
};

export default App;
