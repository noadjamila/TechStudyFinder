import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";
import "@testing-library/jest-dom";

describe("LevelSuccessScreen", () => {
  const mockOnContinue = () => {};

  it("should display 'Level X geschafft!' text initially", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    const levelText = screen.getByText("Level 1 geschafft!");
    if (!levelText) {
      throw new Error("Text 'Level 1 geschafft!' wurde nicht gefunden");
    }
  });

  it("should transition to the next level text after 1.2 seconds", async () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    await waitFor(
      () => {
        const nextLevelText = screen.getByText(
          "Vertiefende Fachinteressen / Spezialisierung",
        );
        if (!nextLevelText) {
          throw new Error("Text für das nächste Level wurde nicht gefunden");
        }
      },
      {
        timeout: 1500,
      },
    );
  });

  it("should call 'onContinue' function when 'Weiter' is clicked", () => {
    const mockOnContinue = () => {};

    render(<LevelSuccessScreen currentLevel={1} onContinue={mockOnContinue} />);

    fireEvent.click(screen.getByText("Weiter"));
  });
});
