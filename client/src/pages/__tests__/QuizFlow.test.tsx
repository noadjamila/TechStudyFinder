import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

vi.mock("../Quiz/QuizPage_L1", () => ({
  __esModule: true,
  default: ({ onNextLevel }: { onNextLevel: (ids: number[]) => void }) => (
    <div>
      <div>Mock Level 1</div>
      <button onClick={() => onNextLevel([1, 2])}>go-to-l2</button>
    </div>
  ),
}));

vi.mock("../Quiz/QuizPage_L2", () => ({
  __esModule: true,
  default: ({
    previousIds,
    onNextLevel,
  }: {
    previousIds: number[];
    onNextLevel: () => void;
  }) => (
    <div>
      <div>Mock Level 2 - previous IDs: {previousIds.join(",")}</div>
      <button onClick={onNextLevel}>go-to-l3</button>
    </div>
  ),
}));

import QuizFlow from "../Quiz/QuizFlow";

describe("QuizFlow", () => {
  test("renders level 1 initially", () => {
    render(<QuizFlow />);

    expect(screen.getByText("Mock Level 1")).toBeInTheDocument();
  });

  test("moves from level 1 to level 2 and passes ids from level 1", () => {
    render(<QuizFlow />);

    // Level 1 to level 2
    fireEvent.click(screen.getByText("go-to-l2"));

    expect(
      screen.getByText("Mock Level 2 - previous IDs: 1,2"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Mock Level 1")).not.toBeInTheDocument();
  });

  test("moves to level 3 (renders nothing) after level 2 onNextLevel", () => {
    const { container } = render(<QuizFlow />);

    // Level 1 to level 2
    fireEvent.click(screen.getByText("go-to-l2"));
    // Level 2 to level 3
    fireEvent.click(screen.getByText("go-to-l3"));

    expect(screen.queryByText("Mock Level 1")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Mock Level 2 - previous IDs/),
    ).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
