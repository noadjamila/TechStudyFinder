import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import StartFlowPage from "../pages/StartFlowPage";

// Mock QuestionStart to simplify testing
jest.mock("../components/QuestionStart", () => (props: any) => {
    return (
        <div>
            <button onClick={() => props.onNext("anfangen")}>Mock Next</button>
        </div>
    );
});

// Mock fetch globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ success: true }),
    })
) as jest.Mock;

describe("StartFlowPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the mocked QuestionStart component", () => {
        const onNextMock = jest.fn();
        render(<StartFlowPage onNext={onNextMock} />);

        // The mocked button should be present
        expect(screen.getByText("Mock Next")).toBeInTheDocument();
    });

    it("calls fetch and onNext when an answer is submitted", async () => {
        const onNextMock = jest.fn();
        render(<StartFlowPage onNext={onNextMock} />);

        // Click the mocked "Next" button
        fireEvent.click(screen.getByText("Mock Next"));

        // fetch should be called with correct arguments
        expect(global.fetch).toHaveBeenCalledWith(
            "http://localhost:5001/api/quiz/start",
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startType: "anfangen" }),
            })
        );

        // onNext should also be called
        expect(onNextMock).toHaveBeenCalled();
    });

    it("handles fetch errors without crashing", async () => {
        const onNextMock = jest.fn();

        // Mock fetch to throw an error
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject("Network Error")
        );

        render(<StartFlowPage onNext={onNextMock} />);
        fireEvent.click(screen.getByText("Mock Next"));

        // onNext should still be called even if fetch fails
        expect(onNextMock).toHaveBeenCalled();

        // fetch should have been called
        expect(global.fetch).toHaveBeenCalled();
    });
});
