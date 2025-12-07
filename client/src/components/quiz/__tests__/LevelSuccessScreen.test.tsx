import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("LevelSuccessScreen", () => {
  const mockOnContinue = vi.fn();

  it("should display 'Level X geschafft!' text initially", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    const levelText = screen.getByText("Level 1 geschafft!");
    expect(levelText).toBeInTheDocument();
  });

  it("should transition to the next level text after 1.2 seconds", async () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    await waitFor(
      () => {
        const nextLevelText = screen.getByText(
          "Vertiefende Fachinteressen / Spezialisierung",
        );
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
