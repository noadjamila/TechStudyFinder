import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Homescreen from './Homescreen';
import '@testing-library/jest-dom';

describe('Homescreen Component', () => {

    // Test to check if the title, subtitle, and button are rendered correctly
    test('renders title, subtitle, and quiz button', () => {
        render(<Homescreen />);

        // Check if the title text "Tech Study Finder" is present in the document
        const title = screen.getByText(/Tech Study Finder/i);
        expect(title).toBeInTheDocument();

        // Check if the subtitle text is present in the document
        const subtitle = screen.getByText(/Finde den Studiengang, der zu dir passt!/i);
        expect(subtitle).toBeInTheDocument();

        // Check if the button text "Quiz Starten" is present in the document
        const button = screen.getByText(/Quiz Starten/i);
        expect(button).toBeInTheDocument();
    });

    // checking if the button is clickable
    test('button click should trigger the click event', () => {
        render(<Homescreen />);


        const button = screen.getByText(/Quiz Starten/i);

        fireEvent.click(button);


        //  checking if the button is clickable.
    });

    // Test to check if the card has the correct background style
    test('card has the correct background style', () => {
        render(<Homescreen />);

        // Check if the card has a transparent background
        const card = screen.getByRole('article');
        expect(card).toHaveStyle('background: transparent');

        // Check if the card has a blur effect
        expect(card).toHaveStyle('backdrop-filter: blur(10px)');
    });

});

