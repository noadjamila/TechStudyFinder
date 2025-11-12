import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question7_L1 from '../components/Question7_L1';

test('shows error if no option chosen', async () => {
    const onNext = jest.fn();
    render(<Question7_L1 onNext={onNext} />);
    await userEvent.click(screen.getByText('Fertig'));
    expect(screen.getByText(/Bitte wähle eine Antwort/i)).toBeInTheDocument();
});

test('calls onNext with "Anwendungsorientiert"', async () => {
    const onNext = jest.fn();
    render(<Question7_L1 onNext={onNext} />);
    await userEvent.click(screen.getByLabelText('Anwendungsorientiert'));
    await userEvent.click(screen.getByText('Fertig'));
    expect(onNext).toHaveBeenCalledWith('Anwendungsorientiert');
});
