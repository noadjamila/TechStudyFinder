import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question1_L1 from '../components/Question1_L1';

test('shows error when nothing selected', async () => {
    const onNext = jest.fn();
    render(<Question1_L1 onNext={onNext} />);
    await userEvent.click(screen.getByText('Weiter'));
    expect(screen.getByText(/Bitte wähle eine Antwort/i)).toBeInTheDocument();
});

test('shows city list if "Ja" selected', async () => {
    const onNext = jest.fn();
    render(<Question1_L1 onNext={onNext} />);
    await userEvent.click(screen.getByLabelText('Ja'));
    expect(screen.getByText(/Bitte wähle eine oder mehrere Städte/i)).toBeInTheDocument();
});

test('calls onNext with cities if valid', async () => {
    const onNext = jest.fn();
    render(<Question1_L1 onNext={onNext} />);
    await userEvent.click(screen.getByLabelText('Ja'));
    await userEvent.click(screen.getByLabelText('Berlin'));
    await userEvent.click(screen.getByText('Weiter'));
    expect(onNext).toHaveBeenCalledWith({ answer: 'Ja', cities: ['Berlin'] });
});
