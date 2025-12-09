import { render, screen, fireEvent } from "@testing-library/react";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("LevelSuccessScreen", () => {
  const mockOnContinue = vi.fn();

  it("should display 'Level 1' and its description", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    expect(screen.getByText("Level 1")).toBeInTheDocument();
    expect(screen.getByText("Deine Rahmenbedingungen")).toBeInTheDocument();
  });

  it("should display 'Level 1 geschafft!' and 'Level 2' with description for Level 2", async () => {
    render(<LevelSuccessScreen currentLevel={2} onContinue={mockOnContinue} />);

    expect(screen.getByText("Level 1 geschafft!")).toBeInTheDocument();
    expect(screen.getByText("Level 2")).toBeInTheDocument();

    expect(screen.getByText("Deine Interessen")).toBeInTheDocument();
  });

  it("should display 'Level 2 geschafft!' and 'Level 3' with description for Level 3", async () => {
    render(<LevelSuccessScreen currentLevel={3} onContinue={mockOnContinue} />);

    expect(screen.getByText("Level 2 geschafft!")).toBeInTheDocument();
    expect(screen.getByText("Level 3")).toBeInTheDocument();

    expect(screen.getByText("Dein Arbeitsstil")).toBeInTheDocument();
  });

  it("should display 'Level 3 geschafft!' and 'Du hast alle Level abgeschlossen' for Level 4", async () => {
    render(<LevelSuccessScreen currentLevel={4} onContinue={mockOnContinue} />);

    expect(screen.getByText("Level 3 geschafft!")).toBeInTheDocument();
    expect(
      screen.getByText("Du hast alle Level abgeschlossen"),
    ).toBeInTheDocument();
  });

  it("should call 'onContinue' function when 'Weiter' is clicked", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    const button = screen.getByText("Weiter");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });
});
