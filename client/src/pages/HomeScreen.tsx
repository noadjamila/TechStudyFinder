import React, { useState } from 'react';
import './HomeScreen.css'; // Import CSS
import { Button, Typography, IconButton, Collapse } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const HomeScreen: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false); // State for collapsing the menu

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Toggle menu visibility
    };

    return (
        <div className="HomeScreen">
            {/* GI Logo */}
            <div className="logo">
                <img src="/logo.png" alt="TechStudyFinder Logo" className="App-logo" />
            </div>

            {/* Main Text: Tech Study Finder */}
            <div className="main-text">
                <Typography variant="h3" gutterBottom>
                    Tech Study Finder
                </Typography>
                <Typography variant="body1" paragraph>
                    Finde den Studiengang, der zu dir passt!
                </Typography>
            </div>

            {/* Info Text about the Quiz */}
            <div className="quiz-info">
                <Typography variant="h6" gutterBottom>
                    Wie lange wird das Quiz dauern?
                </Typography>
                <Typography variant="body2" paragraph>
                    Das Quiz dauert ungefähr 15 Minuten. Beantworte ein paar Fragen, und wir werden dir Studienprogramme vorschlagen, die zu deinen Interessen passen!
                </Typography>
            </div>

            {/* Quiz Button */}
            <Button variant="contained" color="primary" className="quiz-button">
                Quiz Starten
            </Button>

            {/* Collapsible Menu for Impressum and Login */}
            <div className="menu">
                <IconButton onClick={toggleMenu}>
                    <MenuIcon />
                </IconButton>
                <Collapse in={menuOpen}>
                    <div className="menu-items">
                        <Typography variant="body2" className="menu-item">
                            Impressum
                        </Typography>
                        <Typography variant="body2" className="menu-item">
                            Einloggen
                        </Typography>
                    </div>
                </Collapse>
            </div>
        </div>
    );
}

export default HomeScreen;


