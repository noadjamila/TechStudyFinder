import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question4_L1 from '../components/Question4_L1';

test('requires an answer before next', async () => {
    const onNext = jest.fn();
    render(<Question4_L1 onNext={onNext} />);
    await userEvent.click(screen.getByText('Weiter'));
    expect(screen.getByText(/Bitte wähle eine Antwort/i)).toBeInTheDocument();
});

test('calls onNext when valid', async () => {
    const onNext = jest.fn();
    render(<Question4_L1 onNext={onNext} />);
    await userEvent.click(screen.getByLabelText('Ja'));
    await userEvent.click(screen.getByText('Weiter'));
    expect(onNext).toHaveBeenCalledWith('Ja');
});
