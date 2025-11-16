import { render, screen, fireEvent } from "@testing-library/react";
import QuestionStart from "../components/QuestionStart";

describe("QuestionStart", () => {
    it("zeigt die Frage und Optionen an", () => {
        render(<QuestionStart onNext={jest.fn()} />);
        expect(screen.getByText(/Fängst du an zu studieren/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ich fange an zu studieren/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ich will weiter studieren/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ich möchte mich einfach umschauen/i)).toBeInTheDocument();
    });

    it("zeigt einen Fehler, wenn keine Antwort ausgewählt wurde", () => {
        render(<QuestionStart onNext={jest.fn()} />);
        fireEvent.click(screen.getByRole("button", { name: /Weiter/i }));
        expect(screen.getByText(/Bitte wähle eine Antwort aus/i)).toBeInTheDocument();
    });

    it("ruft onNext mit der ausgewählten Antwort auf", () => {
        const onNextMock = jest.fn();
        render(<QuestionStart onNext={onNextMock} />);

        fireEvent.click(screen.getByLabelText(/Ich fange an zu studieren/i));
        fireEvent.click(screen.getByRole("button", { name: /Weiter/i }));

        expect(onNextMock).toHaveBeenCalledWith("anfangen");
    });
});
