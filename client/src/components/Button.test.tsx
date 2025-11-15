import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button Component', () => {
    test('renders the button with the correct label', () => {
        // Render the Button component
        render(<Button />);

        // Get the button element
        const buttonElement = screen.getByRole('button', { name: /button/i });

        // Assert that the button is in the document
        expect(buttonElement).toBeInTheDocument();
    });

    test('applies the correct CSS class', () => {
        // Render the Button component
        render(<Button />);

        // Get the button element
        const buttonElement = screen.getByRole('button', { name: /button/i });

        // Assert that the button has the "custom-button" class
        expect(buttonElement).toHaveClass('custom-button');
    });
});
