import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../buttons/Button";

describe("Button Component", () => {
    it("renders the button with the correct label", () => {
        render(<Button />);

        const buttonElement = screen.getByRole("button", { name: /button/i });
        expect(buttonElement).toBeInTheDocument();
    });
});