import { render, screen, fireEvent } from "@testing-library/react";
import Homescreen from "../Home/Homescreen";
import "@testing-library/jest-dom";
import { vi } from "vitest";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("Homescreen Component", () => {
  it("renders the title, subtitle, info text, and quiz button", () => {
    render(<Homescreen />);

    expect(screen.getByText(/Tech Study Finder/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Finde den Studiengang, der zu dir passt!/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Das Quiz dauert etwa 15 Minuten/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Quiz starten/i)).toBeInTheDocument();
  });

  it("navigates to /quiz/level/1 when clicking the start button", () => {
    mockedNavigate.mockClear();

    render(<Homescreen />);

    const button = screen.getByText(/Quiz starten/i);
    fireEvent.click(button);

    expect(mockedNavigate).toHaveBeenCalledWith("/quiz/level/1");
  });
});
