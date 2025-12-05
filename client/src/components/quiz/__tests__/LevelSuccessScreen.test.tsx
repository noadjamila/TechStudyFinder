import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LevelSuccessScreen, {
  LevelSuccessScreenProps,
} from "../level-success/LevelSuccessScreen";
import { vi } from "vitest";

// Mock the onContinue function
const mockOnContinue = vi.fn();

// Helper function to render the component with props
const renderLevelSuccessScreen = (props: LevelSuccessScreenProps) => {
  render(<LevelSuccessScreen {...props} />);
};

describe("LevelSuccessScreen", () => {
  // Test for level 1 completion message
  it("should render the correct level completion message for level 1", () => {
    renderLevelSuccessScreen({ currentLevel: 1, onContinue: mockOnContinue });

    // Phase 1: Check if "Level 1 geschafft!" is displayed
    expect(screen.getByText(/Level\s*1\s*geschafft!/i)).toBeInTheDocument();
  });

  // Test for the next level message after 1.2 seconds for level 1
  it("should render the correct next level message after 1.2 seconds for level 1", async () => {
    renderLevelSuccessScreen({ currentLevel: 1, onContinue: mockOnContinue });

    // Wait for Phase 2 to appear after 1200ms
    await waitFor(
      () => {
        expect(
          screen.getByText(
            /Next\s*Level:\s*Interessenbasierte\s*Orientierung\s*\(RISEC\)/i, // Check the next level text
          ),
        ).toBeInTheDocument();
      },
      { timeout: 10000 }, // Increased timeout to 10000ms for this test
    );
  });

  // Test for the next level message after 1.2 seconds for level 2
  it("should render the correct next level message after 1.2 seconds for level 2", async () => {
    renderLevelSuccessScreen({ currentLevel: 2, onContinue: mockOnContinue });

    // Phase 1: "Level 2 geschafft!" should be visible
    expect(screen.getByText(/Level\s*2\s*geschafft!/i)).toBeInTheDocument();

    // Wait for Phase 2 to appear after 1200ms
    await waitFor(
      () => {
        expect(
          screen.getByText(
            /Next\s*Level:\s*Vertiefende\s*Fachinteressen\s*\/\s*Spezialisierung/i, // Check the next level text for level 2
          ),
        ).toBeInTheDocument();
      },
      { timeout: 10000 }, // Increased timeout to 10000ms for this test
    );
  });

  // Test for the final level (level 3) and the "Du hast alle Level abgeschlossen" message
  it("should correctly handle level 3 (final level) and show 'Du hast alle Level abgeschlossen'", async () => {
    renderLevelSuccessScreen({ currentLevel: 3, onContinue: mockOnContinue });

    // Phase 1: "Level 3 geschafft!" should be visible
    expect(screen.getByText(/Level\s*3\s*geschafft!/i)).toBeInTheDocument();

    // Wait for Phase 2 to appear after 1200ms
    await waitFor(
      () => {
        expect(
          screen.getByText("Du hast alle Level abgeschlossen"), // Final message for level 3
        ).toBeInTheDocument();
      },
      { timeout: 10000 }, // Increased timeout to 10000ms for this test
    );
  });

  // Test to check if the 'onContinue' function is triggered when the "Weiter" button is clicked
  it("should trigger the onContinue function when the 'Weiter' button is clicked", () => {
    renderLevelSuccessScreen({ currentLevel: 2, onContinue: mockOnContinue });

    // Phase 1: "Level 2 geschafft!" should be visible
    expect(screen.getByText(/Level\s*2\s*geschafft!/i)).toBeInTheDocument();

    // Click the "Weiter" button
    fireEvent.click(screen.getByRole("button", { name: /weiter/i }));

    // Ensure onContinue is called once
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  // Test to ensure phase 2 message does not show before 1.2 seconds
  it("should not display phase 2 message before 1.2 seconds", () => {
    renderLevelSuccessScreen({ currentLevel: 1, onContinue: mockOnContinue });

    // Phase 1: "Level 1 geschafft!" should be visible
    expect(screen.getByText(/Level\s*1\s*geschafft!/i)).toBeInTheDocument();

    // Phase 2 should not be visible yet
    expect(
      screen.queryByText(
        /Next\s*Level:\s*Interessenbasierte\s*Orientierung\s*\(RISEC\)/i, // Check if the next level text is missing
      ),
    ).not.toBeInTheDocument();
  });
});
