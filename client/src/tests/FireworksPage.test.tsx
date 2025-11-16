import { render, screen, fireEvent, act } from "@testing-library/react";
import FireworksPage from "../pages/FireworksPage";
import React from "react";
jest.mock("react-confetti", () => () => <div data-testid="confetti" />);
// Enable fake timers to control setTimeout
jest.useFakeTimers();

describe("FireworksPage", () => {
    it("renders the congratulatory text and button", () => {
        const onContinueMock = jest.fn();
        render(<FireworksPage onContinue={onContinueMock} />);

        // Check if the text is visible
        expect(screen.getByText(/Glückwunsch!/i)).toBeInTheDocument();

        // Check if the button is visible
        const button = screen.getByRole("button", { name: /Weiter/i });
        expect(button).toBeInTheDocument();
    });

    it("calls onContinue when the button is clicked", () => {
        const onContinueMock = jest.fn();
        render(<FireworksPage onContinue={onContinueMock} />);

        fireEvent.click(screen.getByRole("button", { name: /Weiter/i }));
        expect(onContinueMock).toHaveBeenCalled();
    });

    it("shows confetti initially and removes it after 10 seconds", () => {
        render(<FireworksPage onContinue={() => {}} />);

        // Confetti should be present initially (mocked div)
        expect(screen.getByTestId("confetti")).toBeInTheDocument();

        // Fast-forward 10 seconds
        act(() => {
            jest.advanceTimersByTime(10000);
        });

        // Confetti should no longer be rendered
        expect(screen.queryByTestId("confetti")).not.toBeInTheDocument();
    });

});
