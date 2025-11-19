import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Homescreen from '../pages/Homescreen';
import '@testing-library/jest-dom';

describe('Homescreen Component', () => {

    test('renders the title, subtitle, and quiz button', () => {
        render(<Homescreen />);


        const title = screen.getByText(/Tech Study Finder/i);
        expect(title).toBeInTheDocument();


        const subtitle = screen.getByText(/Finde den Studiengang, der zu dir passt!/i);
        expect(subtitle).toBeInTheDocument();

        const infoText = screen.getByText(/ Das Quiz dauert etwa 15 Minuten. Es wird dir helfen, den Studiengang zu finden, der am besten zu dir passt!/i);
        expect(infoText).toBeInTheDocument();


        const button = screen.getByText(/Quiz Starten/i);
        expect(button).toBeInTheDocument();
    });

    test('button click triggers appropriate action', () => {
        render(<Homescreen />);


        const button = screen.getByText(/Quiz Starten/i);


        fireEvent.click(button);


    });
});
