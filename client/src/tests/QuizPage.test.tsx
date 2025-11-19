// __tests__/QuizPage.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuizPage from "../pages/QuizPage";

// Mock QuestionStart
jest.mock("../components/QuestionStart", () => (props: any) => {
    return (
        <div data-testid="question-start">
            <button onClick={() => props.onNext()}>Next from QuestionStart</button>
        </div>
    );
});

// Mock Fireworks
jest.mock("../components/Fireworks", () => (props: any) => {
    return (
        <div data-testid="fireworks">
            <button onClick={() => props.onContinue()}>Continue from Fireworks</button>
        </div>
    );
});

describe("QuizPage", () => {
    it("renders QuestionStart initially", () => {
        render(<QuizPage />);
        expect(screen.getByTestId("question-start")).toBeInTheDocument();
        expect(screen.queryByTestId("fireworks")).not.toBeInTheDocument();
    });

    it("navigates to Fireworks after QuestionStart onNext", () => {
        render(<QuizPage />);

        // Click the Next button in QuestionStart
        fireEvent.click(screen.getByText("Next from QuestionStart"));

        // Fireworks should now be rendered
        expect(screen.getByTestId("fireworks")).toBeInTheDocument();
        expect(screen.queryByTestId("question-start")).not.toBeInTheDocument();
    });

    it("calls onContinue in Fireworks", () => {
        render(<QuizPage />);

        // Move to Fireworks
        fireEvent.click(screen.getByText("Next from QuestionStart"));

        const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        // Click the Continue button
        fireEvent.click(screen.getByText("Continue from Fireworks"));
        expect(consoleSpy).toHaveBeenCalledWith("Next");

        consoleSpy.mockRestore();
    });
});
