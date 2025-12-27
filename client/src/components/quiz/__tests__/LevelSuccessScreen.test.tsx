import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, afterEach, vi } from "vitest";
import LevelSuccessScreen from "../LevelSuccessScreen";

vi.useFakeTimers();

describe("LevelSuccessScreen", () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  test("Level 1 shows next title and text immediately", () => {
    render(<LevelSuccessScreen currentLevel={1} onContinue={vi.fn()} />);

    expect(screen.getByText("Schritt 1")).toBeInTheDocument();
    expect(screen.getByText("Deine Rahmenbedingungen")).toBeInTheDocument();
  });

  test("Level 2 initially shows won title", () => {
    render(<LevelSuccessScreen currentLevel={2} onContinue={vi.fn()} />);

    expect(screen.getByText("Schritt 1 geschafft!")).toBeInTheDocument();

    expect(screen.queryByText("Schritt 2")).not.toBeInTheDocument();
  });

  test("Level 2 switches to next phase after timeout", () => {
    render(<LevelSuccessScreen currentLevel={2} onContinue={vi.fn()} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Schritt 2")).toBeInTheDocument();
    expect(screen.getByText("Deine Interessen")).toBeInTheDocument();
  });

  it("Calls onContinue 2 seconds after reaching the NEXT phase", () => {
    const onContinue = vi.fn();

    render(<LevelSuccessScreen currentLevel={2} onContinue={onContinue} />);

    // WON -> NEXT
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // NEXT -> onContinue
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  test("Level 3 shows results after timeout", () => {
    render(<LevelSuccessScreen currentLevel={3} onContinue={vi.fn()} />);

    expect(screen.getByText("Schritt 2 geschafft!")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Deine Ergebnisse")).toBeInTheDocument();
    expect(
      screen.getByText("Du hast alle Schritte abgeschlossen"),
    ).toBeInTheDocument();
  });

  test("Level 4 renders no text content", () => {
    render(<LevelSuccessScreen currentLevel={4} onContinue={vi.fn()} />);

    // Es soll bewusst nichts angezeigt werden
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });
});
