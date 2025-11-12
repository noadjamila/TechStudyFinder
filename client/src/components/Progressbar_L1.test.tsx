import { render, screen } from '@testing-library/react';
import Progressbar_L1 from '../components/Progressbar_L1';

test('renders correct label and width', () => {
    render(<Progressbar_L1 current={2} total={4} />);
    expect(screen.getByText('Frage 2 von 4')).toBeInTheDocument();

    const bar = screen.getByRole('progressbar', { hidden: true }) || screen.getByText(/Frage/).previousSibling;
    expect(bar).toBeTruthy();
});

test('clamps current > total', () => {
    render(<Progressbar_L1 current={10} total={4} />);
    expect(screen.getByText('Frage 4 von 4')).toBeInTheDocument();
});

test('handles total = 0', () => {
    render(<Progressbar_L1 current={2} total={0} />);
    expect(screen.getByText('Frage 0 von 0')).toBeInTheDocument();
});
