import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import QuestionStart from "../components/QuestionStart";

/**
 * Tests for the QuestionStart component
 *
 * This test suite verifies the behavior of the QuestionStart component,
 * which represents the first question in the quiz flow. The component
 * immediately triggers the onNext callback when a user selects an option
 * and sends the selected answer to the backend via a POST request.
 *
 * The tests cover:
 * 1. Rendering: ensures the question and all three options are displayed.
 * 2. onNext Callback: verifies that onNext is called immediately when an option is clicked.
 * 3. API Call: checks that the correct fetch request is made with the selected answer.
 * 4. Error Handling: confirms that onNext is still called even if the fetch request fails.
 * 5. All Options: ensures the component works correctly for each possible choice.
 *
 * Notes:
 * - The fetch function is mocked globally to avoid real network requests.
 * - waitFor is used to handle asynchronous fetch calls before asserting results.
 */

// Mock the global fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ success: true }),
    })
) as jest.Mock;

describe("QuestionStart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the question and all answer options", () => {
        render(<QuestionStart onNext={jest.fn()} />);

        expect(screen.getByText(/Fängst du an zu studieren/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ich fange an zu studieren/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ich will weiter studieren/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ich möchte mich einfach umschauen/i)).toBeInTheDocument();
    });

    it("calls onNext with the selected answer and triggers the API call", async () => {
        const onNextMock = jest.fn();
        render(<QuestionStart onNext={onNextMock} />);

        // Click the first option
        fireEvent.click(screen.getByLabelText(/Ich fange an zu studieren/i));

        // Wait for the fetch call to complete
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:5001/api/quiz/start",
                expect.objectContaining({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startType: "anfangen" }),
                })
            );
        });

        // Ensure onNext is called with the selected answer
        expect(onNextMock).toHaveBeenCalledWith("anfangen");
    });

    it("calls onNext correctly for the other options", async () => {
        const onNextMock = jest.fn();
        render(<QuestionStart onNext={onNextMock} />);

        // Click the second option
        fireEvent.click(screen.getByLabelText(/Ich will weiter studieren/i));
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: JSON.stringify({ startType: "weiterstudieren" }),
                })
            );
        });
        expect(onNextMock).toHaveBeenCalledWith("weiterstudieren");

        // Click the third option
        fireEvent.click(screen.getByLabelText(/Ich möchte mich einfach umschauen/i));
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: JSON.stringify({ startType: "umschauen" }),
                })
            );
        });
        expect(onNextMock).toHaveBeenCalledWith("umschauen");
    });

    it("handles fetch errors without crashing and still calls onNext", async () => {
        // Make fetch reject once
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject("Network Error")
        );

        const onNextMock = jest.fn();
        render(<QuestionStart onNext={onNextMock} />);

        // Click an option
        fireEvent.click(screen.getByLabelText(/Ich fange an zu studieren/i));

        await waitFor(() => {
            // onNext should still be called even if fetch fails
            expect(onNextMock).toHaveBeenCalledWith("anfangen");
        });

        // fetch should have been called
        expect(global.fetch).toHaveBeenCalled();
    });
});
