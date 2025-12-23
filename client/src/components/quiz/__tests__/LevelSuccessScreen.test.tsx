import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import LevelSuccessScreen from "../level-success/LevelSuccessScreen";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

beforeEach(() => {
  vi.useFakeTimers();
  mockedNavigate.mockClear();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

const renderWithRouter = (currentLevel: 1 | 2 | 3) => {
  return render(
    <MemoryRouter>
      <LevelSuccessScreen currentLevel={currentLevel} />
    </MemoryRouter>,
  );
};

describe("LevelSuccessScreen", () => {
  test("Level 1 shows next title and text immediately", () => {
    renderWithRouter(1);

    expect(screen.getByText("Schritt 1")).toBeInTheDocument();
    expect(screen.getByText("Deine Rahmenbedingungen")).toBeInTheDocument();
  });

  test("Level 2 initially shows won title", () => {
    renderWithRouter(2);

    expect(screen.getByText("Schritt 1 geschafft!")).toBeInTheDocument();

    expect(screen.queryByText("Schritt 2")).not.toBeInTheDocument();
  });

  test("Level 2 switches to next phase after timeout", () => {
    renderWithRouter(2);

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.getByText("Schritt 2")).toBeInTheDocument();
    expect(screen.getByText("Deine Interessen")).toBeInTheDocument();
  });

  test("Level 3 shows results after timeout", () => {
    renderWithRouter(3);

    expect(screen.getByText("Schritt 2 geschafft!")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.getByText("Deine Ergebnisse")).toBeInTheDocument();
    expect(
      screen.getByText("Du hast alle Schritte abgeschlossen"),
    ).toBeInTheDocument();
  });
});
