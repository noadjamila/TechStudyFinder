import React from "react";
import "./App.css";
import { Button, Typography, IconButton } from "@mui/material";
import { Home } from "@mui/icons-material";

function App() {
  return (
    <div className="App-header">
      {/* Logo */}
      <img src="/logo.png" alt="TechStudyFinder Logo" className="App-logo" />

      {/* Title */}
      <Typography variant="h1" gutterBottom>
        Tech Study Finder
      </Typography>

      {/* Description  */}
      <Typography variant="body1">
        Finde den Studiengang, der zu dir passt!
      </Typography>

      {/* Primary Button */}
      <Button className="btn-primary">Primary Button</Button>

      {/* Secondary Button */}
      <Button className="btn-secondary" style={{ marginLeft: "16px" }}>
        Secondary Button
      </Button>

      {/* Icon Button */}
      <IconButton className="btn-primary" style={{ marginLeft: "16px" }}>
        <Home />
      </IconButton>
    </div>
  );
}

export default App;
