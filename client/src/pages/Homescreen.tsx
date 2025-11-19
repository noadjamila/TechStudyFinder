import React from 'react';
import { Typography } from '@mui/material';
import LogoMenu from '../components/LogoMenu';
import Button from '../components/Button';
import './Homescreen.css';

const Homescreen: React.FC = () => {
    return (
        <div className="homescreen-container">
            <LogoMenu />


            <div className="text-content">
                {/* Main Content */}
                <Typography variant="h4" className="title">
                    Tech Study Finder
                </Typography>
                <Typography variant="h6" className="subtitle">
                    Finde den Studiengang, der zu dir passt!
                </Typography>


                <div className="info-text">
                    <Typography variant="body1">
                        Das Quiz dauert etwa 5 Minuten. Es wird dir helfen, den Studiengang zu finden, der am besten zu dir passt!
                    </Typography>
                </div>

                {/* Quiz Starten Button */}
                <Button />
            </div>
        </div>
    );
};

export default Homescreen;
