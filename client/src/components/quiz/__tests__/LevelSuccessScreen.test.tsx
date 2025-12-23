import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import LevelSuccessScreen from "../LevelSuccessScreen";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("LevelSuccessScreen", () => {
  test("Level 1 shows next title and text immediately", () => {
    render(<LevelSuccessScreen currentLevel={1} />);

    expect(screen.getByText("Schritt 1")).toBeInTheDocument();
    expect(screen.getByText("Deine Rahmenbedingungen")).toBeInTheDocument();
  });

  test("Level 2 initially shows won title", () => {
    render(<LevelSuccessScreen currentLevel={2} />);

    expect(screen.getByText("Schritt 1 geschafft!")).toBeInTheDocument();

    expect(screen.queryByText("Schritt 2")).not.toBeInTheDocument();
  });

  test("Level 2 switches to next phase after timeout", () => {
    render(<LevelSuccessScreen currentLevel={2} />);

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.getByText("Schritt 2")).toBeInTheDocument();
    expect(screen.getByText("Deine Interessen")).toBeInTheDocument();
  });

  test("Level 3 shows results after timeout", () => {
    render(<LevelSuccessScreen currentLevel={3} />);

    expect(screen.getByText("Schritt 2 geschafft!")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.getByText("Deine Ergebnisse")).toBeInTheDocument();
    expect(
      screen.getByText("Du hast alle Schritte abgeschlossen"),
    ).toBeInTheDocument();
  });

  test("Level 4 renders no text content", () => {
    render(<LevelSuccessScreen currentLevel={4} />);

    // Es soll bewusst nichts angezeigt werden
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });
});
