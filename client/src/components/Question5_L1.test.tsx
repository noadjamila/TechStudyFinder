import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question5_L1 from '../components/Question5_L1';

test('shows error when no answer selected', async () => {
    const onNext = jest.fn();
    render(<Question5_L1 onNext={onNext} />);
    await userEvent.click(screen.getByText('Weiter'));
    expect(screen.getByText(/Bitte wähle eine Antwort/i)).toBeInTheDocument();
});

test('calls onNext with correct answer', async () => {
    const onNext = jest.fn();
    render(<Question5_L1 onNext={onNext} />);
    await userEvent.click(screen.getByLabelText('Nein'));
    await userEvent.click(screen.getByText('Weiter'));
    expect(onNext).toHaveBeenCalledWith('Nein');
});
