import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import FireworksPage from "../components/Fireworks";

// Mock react-confetti
jest.mock("react-confetti", () => () => <div data-testid="confetti" />);

describe("Fireworks", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("renders congratulatory message and Continue button", () => {
        const onContinueMock = jest.fn();
        render(<FireworksPage onContinue={onContinueMock} />);

        expect(screen.getByText(/Glückwunsch/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Weiter/i })).toBeInTheDocument();
    });

    it("shows confetti initially", () => {
        render(<FireworksPage onContinue={() => {}} />);
        expect(screen.getByTestId("confetti")).toBeInTheDocument();
    });

    it("calls onContinue when the Continue button is clicked", () => {
        const onContinueMock = jest.fn();
        render(<FireworksPage onContinue={onContinueMock} />);
        fireEvent.click(screen.getByRole("button", { name: /Weiter/i }));
        expect(onContinueMock).toHaveBeenCalled();
    });

    it("hides confetti after 10 seconds", () => {
        render(<FireworksPage onContinue={() => {}} />);

        // Initially, confetti should be visible
        expect(screen.getByTestId("confetti")).toBeInTheDocument();

        // Advance timers by 10 seconds
        act(() => {
            jest.advanceTimersByTime(10000);
        });

        // Confetti should no longer be in the document
        expect(screen.queryByTestId("confetti")).not.toBeInTheDocument();
    });
});
