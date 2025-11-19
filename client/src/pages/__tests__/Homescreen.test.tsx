import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Homescreen from "../Homescreen";
import "@testing-library/jest-dom";

describe("Homescreen Component", () => {
  it("renders the title, subtitle, info text, and quiz button", () => {
    render(
      <MemoryRouter>
        <Homescreen />
      </MemoryRouter>,
    );

    const title = screen.getByText(/Tech Study Finder/i);
    expect(title).toBeInTheDocument();

    const subtitle = screen.getByText(
      /Finde den Studiengang, der zu dir passt!/i,
    );
    expect(subtitle).toBeInTheDocument();

    const infoText = screen.getByText(
      /Das Quiz dauert etwa 15 Minuten. Es wird dir helfen, den Studiengang zu finden, der am besten zu dir passt./i,
    );
    expect(infoText).toBeInTheDocument();

    const button = screen.getByText(/Quiz Starten/i);
    expect(button).toBeInTheDocument();
  });

  it("button click triggers appropriate action", () => {
    render(
      <MemoryRouter>
        <Homescreen />
      </MemoryRouter>,
    );

    const button = screen.getByText(/Quiz Starten/i);

    fireEvent.click(button);
  });
});
