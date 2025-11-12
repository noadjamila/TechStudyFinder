import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question3_L1 from '../components/Question3_L1';

test('shows validation error if no option selected', async () => {
    const onNext = jest.fn();
    render(<Question3_L1 onNext={onNext} />);
    await userEvent.click(screen.getByText('Weiter'));
    expect(screen.getByText(/Bitte wähle einen Schulabschluss/i)).toBeInTheDocument();
});

test('calls onNext with selected degree', async () => {
    const onNext = jest.fn();
    render(<Question3_L1 onNext={onNext} />);
    await userEvent.selectOptions(
        screen.getByRole('combobox'),
        'Allgemeine Hochschulreife (Abitur)'
    );
    await userEvent.click(screen.getByText('Weiter'));
    expect(onNext).toHaveBeenCalledWith('Allgemeine Hochschulreife (Abitur)');
});
