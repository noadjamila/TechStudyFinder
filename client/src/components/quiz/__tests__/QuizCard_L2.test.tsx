import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import QuizCard_L2 from "../QuizCard_L2";

jest.useFakeTimers();

describe("QuizCard_L2", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnSelect.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("shows the submitted question", () => {
    render(<QuizCard_L2 question="Frage?" onSelect={mockOnSelect} />);
    expect(screen.getByText("Frage?")).toBeInTheDocument();
  });

  test("shows all answer options", () => {
    render(<QuizCard_L2 question="Frage?" onSelect={mockOnSelect} />);
    expect(screen.getByLabelText("Ja")).toBeInTheDocument();
    expect(screen.getByLabelText("Nein")).toBeInTheDocument();
    expect(screen.getByLabelText("Überspringen")).toBeInTheDocument();
  });

  test("calls onSelect with correct option after the animation", async () => {
    render(<QuizCard_L2 question="Frage?" onSelect={mockOnSelect} />);
    const yesOption = screen.getByLabelText("Ja");

    fireEvent.click(yesOption);

    act(() => {
      jest.advanceTimersByTime(800);
    });

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith("yes");
    });
  });
});
