import React from 'react';
import { Button, Typography } from '@mui/material';
import LogoMenu from '../components/LogoMenu';
import './Homescreen.css';

const Homescreen: React.FC = () => {
    return (
        <div className="homescreen-container">
            {/* Verwende die LogoMenu-Komponente */}
            <LogoMenu />

            {/* Main Content */}
            <div className="content">
                <Typography variant="h4" className="title">
                    Tech Study Finder
                </Typography>
                <Typography variant="h6" className="subtitle">
                    Finde den Studiengang, der zu dir passt!
                </Typography>

                {/* Info text about quiz */}
                <div className="info-text">
                    <Typography variant="body1">
                        Das Quiz dauert etwa 5 Minuten. Es wird dir helfen, den Studiengang zu finden, der am besten zu dir passt!
                    </Typography>
                </div>

                {/* Start Quiz Button */}
                <Button variant="contained" color="primary" className="quiz-button">
                    Quiz Starten
                </Button>
            </div>
        </div>
    );
};

export default Homescreen;

