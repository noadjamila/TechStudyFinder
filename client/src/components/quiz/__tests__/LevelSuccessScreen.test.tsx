import { render, screen } from "@testing-library/react";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("LevelSuccessScreen", () => {
  const mockOnContinue = vi.fn();

  it("should display 'Schritt 1' and its description", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    // Test for Schritt 1
    expect(screen.getByText("Schritt 1")).toBeInTheDocument();
    expect(screen.getByText("Deine Rahmenbedingungen")).toBeInTheDocument();
  });

  it("should display 'Schritt 1' and 'Geschafft!' and 'Schritt 2' with description for Level 2", async () => {
    render(<LevelSuccessScreen currentLevel={2} onContinue={mockOnContinue} />);

    // Test for Schritt 1 and "Geschafft!"
    expect(screen.getByText(/Schritt 1 geschafft!/i)).toBeInTheDocument();

    // Test for Schritt 2 and the description
    expect(screen.getByText("Schritt 2")).toBeInTheDocument();
    expect(screen.getByText("Deine Interessen")).toBeInTheDocument();
  });

  it("should display 'Schritt 2' and 'Geschafft!' for Level 3", async () => {
    render(<LevelSuccessScreen currentLevel={3} onContinue={mockOnContinue} />);

    // Test for Schritt 2 and "Geschafft!"
    expect(screen.getByText(/Schritt 2 geschafft!/i)).toBeInTheDocument();
  });

  it("should display 'Schritt 3' and 'Geschafft!' and 'Du hast alle Schritte abgeschlossen' for Level 4", async () => {
    render(<LevelSuccessScreen currentLevel={4} onContinue={mockOnContinue} />);

    // Test for Schritt 3 and "Geschafft!"
    expect(screen.getByText(/Schritt 3 geschafft!/i)).toBeInTheDocument();

    // Test for the close message
    expect(
      screen.getByText("Du hast alle Schritte abgeschlossen"),
    ).toBeInTheDocument();
  });
});
