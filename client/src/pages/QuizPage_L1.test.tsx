import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuizPage_L1 from '../pages/QuizPage_L1';

test('renders first question and progresses', async () => {
    render(<QuizPage_L1 />);
    expect(screen.getByText('Frage 1')).toBeInTheDocument();

    // Select "Nein" and continue
    await userEvent.click(screen.getByLabelText('Nein'));
    await userEvent.click(screen.getByText('Weiter'));
    expect(screen.getByText('Frage 2')).toBeInTheDocument();
});

test('completes quiz flow', async () => {
    render(<QuizPage_L1 />);
    // Simulate going through all 7 steps quickly
    const clickNext = async (label: string) => {
        await userEvent.click(screen.getByLabelText(label));
        await userEvent.click(screen.getByText(/Weiter|Fertig/));
    };

    await clickNext('Nein'); // q1
    await clickNext('Bachelor'); // q2
    await userEvent.selectOptions(screen.getByRole('combobox'), "Allgemeine Hochschulreife (Abitur)");
    await userEvent.click(screen.getByText('Weiter'));
    await clickNext('Nein'); // q4
    await clickNext('Nein'); // q5
    await clickNext('Nein'); // q6
    await clickNext('Anwendungsorientiert'); // q7

    expect(screen.getByText(/Ergebnisse/i)).toBeInTheDocument();
});
