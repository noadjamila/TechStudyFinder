import { render, screen } from "@testing-library/react";
import QuizLayout, { QuizLayoutProps } from "../layouts/QuizLayout";

const DummyChild = () => <div>Test Content</div>;

describe("QuizLayout", () => {
  const defaultProps: QuizLayoutProps = {
    currentIndex: 2,
    questionsTotal: 10,
    children: <DummyChild />,
  };

  test("renders the progressbar with correct props", () => {
    render(<QuizLayout {...defaultProps} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();

    expect(
      screen.getByText(
        `Frage ${defaultProps.currentIndex} von ${defaultProps.questionsTotal}`,
      ),
    ).toBeInTheDocument();
  });

  test("renders children correctly", () => {
    render(<QuizLayout {...defaultProps} />);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
