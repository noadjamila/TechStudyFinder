import React from "react";
import { Typography } from "@mui/material";
import LogoMenu from "../components/LogoMenu/LogoMenu";
import Button from "../components/buttons/Button";
import "./Homescreen.css";

const Homescreen: React.FC = () => {
  const handleQuizStart = () => {
    console.log("Quiz gestartet");
  };

  return (
    <div className="homescreen-container">
      <LogoMenu />

      <div className="text-content">
        <Typography variant="h4" className="title">
          Tech Study Finder
        </Typography>
        <Typography variant="h6" className="subtitle">
          Finde den Studiengang, der zu dir passt!
        </Typography>

        <div className="info-text">
          <Typography variant="body1">
            Das Quiz dauert etwa 15 Minuten. Es wird dir helfen, den Studiengang
            zu finden, der am besten zu dir passt!
          </Typography>
        </div>

        <Button label="Quiz Starten" onClick={handleQuizStart} />
      </div>
    </div>
  );
};

export default Homescreen;
