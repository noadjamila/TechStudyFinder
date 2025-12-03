import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";

describe("LevelSuccessScreen (AK-compliant)", () => {
  it("shows the initial success text 'Level1 {level} geschafft!' on first render", () => {
    render(<LevelSuccessScreen currentLevel={1} />);

    // first show the success message
    expect(screen.getByText(/Level1\s+1\s+geschafft!/i)).toBeInTheDocument();
  });

  it("switches to the next level description after 1200ms for level 1", async () => {
    vi.useFakeTimers();

    const { rerender } = render(<LevelSuccessScreen currentLevel={1} />);

    // Initially: only "Level completed"
    expect(screen.getByText(/Level1\s+1\s+geschafft!/i)).toBeInTheDocument();

    // Wait for the transition delay to finish
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    rerender(<LevelSuccessScreen currentLevel={1} />);

    // transition to next level text
    const next = await screen.findByText(
      /Interessenbasierte Orientierung\s*\(RISEC\)/i,
    );

    expect(next).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("shows the final completion text for level 3 after the delay", async () => {
    vi.useFakeTimers();

    render(<LevelSuccessScreen currentLevel={3} />);

    // Phase 1: success text
    expect(screen.getByText(/Level1\s+3\s+geschafft!/i)).toBeInTheDocument();
    // Switch to phase 2
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Final message
    expect(
      screen.getByText("Du hast alle Level abgeschlossen"),
    ).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("calls onContinue when the button is clicked", () => {
    const onContinue = vi.fn();

    render(<LevelSuccessScreen currentLevel={2} onContinue={onContinue} />);

    // Click the 'Weiter' button
    screen.getByRole("button", { name: /weiter/i }).click();

    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
