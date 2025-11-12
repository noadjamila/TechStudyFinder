import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question6_L1 from '../components/Question6_L1';

test('shows validation error if nothing selected', async () => {
    const onNext = jest.fn();
    render(<Question6_L1 onNext={onNext} />);
    await userEvent.click(screen.getByText('Weiter'));
    expect(screen.getByText(/Bitte wähle eine Antwort/i)).toBeInTheDocument();
});

test('calls onNext with "Ja"', async () => {
    const onNext = jest.fn();
    render(<Question6_L1 onNext={onNext} />);
    await userEvent.click(screen.getByLabelText('Ja'));
    await userEvent.click(screen.getByText('Weiter'));
    expect(onNext).toHaveBeenCalledWith('Ja');
});
