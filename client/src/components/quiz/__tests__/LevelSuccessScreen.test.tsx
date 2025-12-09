import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("LevelSuccessScreen", () => {
  const mockOnContinue = vi.fn();

  it("should display 'Level 1' description without 'Level X geschafft!' initially", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    const levelDescription = screen.getByText("Deine Rahmenbedingungen");
    expect(levelDescription).toBeInTheDocument();

    const levelText = screen.queryByText("Level 1 geschafft!");
    expect(levelText).not.toBeInTheDocument();
  });

  it("should transition to the next level description after 1.2 seconds for Level 2", async () => {
    render(<LevelSuccessScreen currentLevel={2} onContinue={mockOnContinue} />);

    await waitFor(
      () => {
        const nextLevelText = screen.getByText("Dein Arbeitsstil");
        expect(nextLevelText).toBeInTheDocument();
      },
      {
        timeout: 1500,
      },
    );
  });

  it("should transition to the next level description after 1.2 seconds for Level 3", async () => {
    render(<LevelSuccessScreen currentLevel={3} onContinue={mockOnContinue} />);

    await waitFor(
      () => {
        const nextLevelText = screen.getByText("Verfeinerung");
        expect(nextLevelText).toBeInTheDocument();
      },
      {
        timeout: 1500,
      },
    );
  });

  it("should call 'onContinue' function when 'Weiter' is clicked", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    fireEvent.click(screen.getByText("Weiter"));

    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });
});
