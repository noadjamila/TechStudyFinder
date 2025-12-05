import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";

describe("LevelSuccessScreen (AK-compliant)", async () => {
  it("shows the initial success text 'Level1 {level} geschafft!' on first render", () => {
    render(<LevelSuccessScreen currentLevel={1} />);
    expect(screen.getByText(/Level1\s+1\s+geschafft!/i)).toBeInTheDocument();
  });

  it("switches to the next level description after 1200ms for level 1", async () => {
    vi.useFakeTimers();

    render(<LevelSuccessScreen currentLevel={1} />);

    // Phase 1 visible initially
    expect(screen.getByText(/Level1\s+1\s+geschafft!/i)).toBeInTheDocument();

    // Advance the timers to trigger the transition
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Check for the next-level description for Level 1
    const next = await screen.findByText(
      /Interessenbasierte Orientierung\s*\(RISEC\)/i,
    );
    expect(next).toBeInTheDocument();

    vi.useRealTimers();
  }, 10000); // Increase the timeout for CI environments

  it("switches to the next level description after 1200ms for level 2", async () => {
    vi.useFakeTimers();

    render(<LevelSuccessScreen currentLevel={2} />);

    // Phase 1 visible for Level 2
    expect(screen.getByText(/Level1\s+2\s+geschafft!/i)).toBeInTheDocument();

    // Advance the timers to trigger the transition
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Check for the next-level description for Level 2
    const next = await screen.findByText(
      /Vertiefende Fachinteressen \/ Spezialisierung/i,
    );
    expect(next).toBeInTheDocument();

    vi.useRealTimers();
  }, 10000); // Increase the timeout for CI environments

  it("shows the final completion text for level 3 after the delay", async () => {
    vi.useFakeTimers();

    render(<LevelSuccessScreen currentLevel={3} />);

    // Phase 1: success text for Level 3
    expect(screen.getByText(/Level1\s+3\s+geschafft!/i)).toBeInTheDocument();

    // Switch to phase 2 for Level 3
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Final message for Level 3
    expect(
      screen.getByText("Du hast alle Level abgeschlossen"),
    ).toBeInTheDocument();

    vi.useRealTimers();
  }, 10000); // Increase the timeout for CI environments

  it("calls onContinue when the button is clicked", () => {
    const onContinue = vi.fn();

    render(<LevelSuccessScreen currentLevel={2} onContinue={onContinue} />);

    // Click the 'Weiter' button
    screen.getByRole("button", { name: /weiter/i }).click();

    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
