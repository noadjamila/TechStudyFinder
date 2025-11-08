import React, { useState }from "react";
import "../HomeScreen.css";


const HomeScreen = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleOpenMenu = () => setIsMenuOpen(true);
    const handleCloseMenu = () => setIsMenuOpen(false);

    return (
        <div className="App">
        <header className="App-header">
            <img src="/logo.png" className="Tech Study Finder Logo" alt="logo" />
            <h1>Tech Study Finder</h1>
            <p>Finde den Studiengang, der zu dir passt!</p>

            <div className="menu-icon" onClick={handleOpenMenu}></div>

            {isMenuOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-btn" onClick={handleCloseMenu}></button>
                        <ul>
                            <li><a href="/impressum">Impressum</a></li>
                            <li><a href="/login">Einloggen</a></li>

                        </ul>
                    </div>
                </div>
            )}

            <button className="btn-primary">Quiz starten</button>

        </header>
        </div>
    );
};
export default HomeScreen;