import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LevelSuccessScreen, {
  LevelSuccessScreenProps,
} from "../level-success/LevelSuccessScreen";
import { vi } from "vitest";

const mockOnContinue = vi.fn();

const renderLevelSuccessScreen = (props: LevelSuccessScreenProps) => {
  render(<LevelSuccessScreen {...props} />);
};

describe("LevelSuccessScreen", () => {
  it("should render the correct level completion message for level 1", () => {
    renderLevelSuccessScreen({ currentLevel: 1, onContinue: mockOnContinue });

    // Phase 1: "Level 1 geschafft!"
    expect(screen.getByText(/Level\s*1\s*geschafft!/i)).toBeInTheDocument();
  });

  it("should render the correct next level message after 1.2 seconds for level 1", async () => {
    renderLevelSuccessScreen({ currentLevel: 1, onContinue: mockOnContinue });

    // Wait for Phase 2 to appear after 1200ms
    await waitFor(
      () => {
        expect(
          screen.getByText(
            /Next\s*Level:\s*Interessenbasierte\s*Orientierung\s*\(RISEC\)/i,
          ),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("should render the correct next level message after 1.2 seconds for level 2", async () => {
    renderLevelSuccessScreen({ currentLevel: 2, onContinue: mockOnContinue });

    // Phase 1: "Level 2 geschafft!"
    expect(screen.getByText(/Level\s*2\s*geschafft!/i)).toBeInTheDocument();

    // Wait for Phase 2 to appear after 1200ms
    await waitFor(
      () => {
        expect(
          screen.getByText(
            /Next\s*Level:\s*Vertiefende\s*Fachinteressen\s*\/\s*Spezialisierung/i,
          ),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("should correctly handle level 3 (final level) and show 'Du hast alle Level abgeschlossen'", async () => {
    renderLevelSuccessScreen({ currentLevel: 3, onContinue: mockOnContinue });

    // Phase 1: "Level 3 geschafft!"
    expect(screen.getByText(/Level\s*3\s*geschafft!/i)).toBeInTheDocument();

    // Wait for Phase 2 to appear after 1200ms
    await waitFor(
      () => {
        expect(
          screen.getByText("Du hast alle Level abgeschlossen"),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it("should trigger the onContinue function when the 'Weiter' button is clicked", () => {
    renderLevelSuccessScreen({ currentLevel: 2, onContinue: mockOnContinue });

    // Phase 1: "Level 2 geschafft!"
    expect(screen.getByText(/Level\s*2\s*geschafft!/i)).toBeInTheDocument();

    // Click the "Weiter" button
    fireEvent.click(screen.getByRole("button", { name: /weiter/i }));

    // Ensure onContinue is called
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("should not display phase 2 message before 1.2 seconds", () => {
    renderLevelSuccessScreen({ currentLevel: 1, onContinue: mockOnContinue });

    // Phase 1: "Level 1 geschafft!"
    expect(screen.getByText(/Level\s*1\s*geschafft!/i)).toBeInTheDocument();

    // Phase 2 should not be visible yet
    expect(
      screen.queryByText(
        /Next\s*Level:\s*Interessenbasierte\s*Orientierung\s*\(RISEC\)/i,
      ),
    ).not.toBeInTheDocument();
  });
});
