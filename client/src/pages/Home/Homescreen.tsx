import React from "react";
import { Box, Typography } from "@mui/material";
import LogoMenu from "../../components/logo-menu/LogoMenu";
import Button from "../../components/buttons/Button";
import "./Homescreen.css";
import { useNavigate } from "react-router-dom";

const Homescreen: React.FC = () => {
  const navigate = useNavigate();

  const handleQuizStart = () => {
    navigate("/quiz/level/1");
  };

  return (
    <div className="homescreen-container">
      <LogoMenu />

      <Box
        className="text-content"
        sx={{
          maxWidth: { xs: "90%", sm: "600px", md: "700px" },
          mx: "auto",
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4" className="title">
          Tech Study Finder
        </Typography>

        <Typography variant="h6" className="subtitle">
          Finde den Studiengang, der zu dir passt!
        </Typography>

        <Box className="info-text" sx={{ mt: 2, mb: 4 }}>
          <Typography variant="body1">
            Das Quiz dauert etwa 15 Minuten. Es wird dir helfen, den Studiengang
            zu finden, der am besten zu dir passt.
          </Typography>
        </Box>

        <Button
          label="Quiz starten"
          onClick={handleQuizStart}
          color="primary"
          sx={{
            padding: "10px 20px",
            fontSize: "1.1rem",
          }}
        />
      </Box>
    </div>
  );
};

export default Homescreen;
