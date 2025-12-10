import { render, screen } from "@testing-library/react";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("LevelSuccessScreen", () => {
  const mockOnContinue = vi.fn();

  it("should display 'Schritt 1' and its description", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    expect(screen.getByText("Schritt 1")).toBeInTheDocument();
    expect(screen.getByText("Deine Rahmenbedingungen")).toBeInTheDocument();
  });

  it("should display 'Schritt 1 geschafft!' and 'Schritt 2' with description for Level 2", async () => {
    render(<LevelSuccessScreen currentLevel={2} onContinue={mockOnContinue} />);

    expect(screen.getByText("Schritt 1 geschafft!")).toBeInTheDocument();
    expect(screen.getByText("Schritt 2")).toBeInTheDocument();

    expect(screen.getByText("Deine Interessen")).toBeInTheDocument();
  });

  it("should display 'Schritt 2 geschafft!' and 'Schritt 3' with description for Schritt 3", async () => {
    render(<LevelSuccessScreen currentLevel={3} onContinue={mockOnContinue} />);

    expect(screen.getByText("Schritt 2 geschafft!")).toBeInTheDocument();
    expect(screen.getByText("Schritt 3")).toBeInTheDocument();

    expect(screen.getByText("Dein Arbeitsstil")).toBeInTheDocument();
  });

  it("should display 'Schritt 3 geschafft!' and 'Du hast alle Schritte abgeschlossen' for Schritt 4", async () => {
    render(<LevelSuccessScreen currentLevel={4} onContinue={mockOnContinue} />);

    expect(screen.getByText("Schritt 3 geschafft!")).toBeInTheDocument();
    expect(
      screen.getByText("Du hast alle Schritte abgeschlossen"),
    ).toBeInTheDocument();
  });
});
