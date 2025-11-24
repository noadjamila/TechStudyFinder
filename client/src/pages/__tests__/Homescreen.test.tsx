import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import Homescreen from "../Homescreen";
import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe("Homescreen Component", () => {
  it("renders the title, subtitle, info text, and quiz button", () => {
    render(
      <MemoryRouter>
        <Homescreen />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Tech Study Finder/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Finde den Studiengang, der zu dir passt!/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Das Quiz dauert etwa 15 Minuten/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Quiz starten/i)).toBeInTheDocument();
  });

  it("navigates to /quiz when clicking the start button", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Homescreen />
        <LocationDisplay />
      </MemoryRouter>,
    );

    const button = screen.getByText(/Quiz starten/i);
    fireEvent.click(button);

    expect(screen.getByTestId("location")).toHaveTextContent("/quiz");
  });
});
