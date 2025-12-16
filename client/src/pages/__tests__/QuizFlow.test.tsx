import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";

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

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(() => ({ level: "1" })),
  };
});

import QuizFlow from "../Quiz/QuizFlow";
import * as ReactRouterDOM from "react-router-dom";

describe("QuizFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders level 1 initially", () => {
    vi.mocked(ReactRouterDOM.useParams).mockReturnValue({ level: "1" } as any);
    render(
      <MemoryRouter initialEntries={["/quiz/level/1"]}>
        <QuizFlow />
      </MemoryRouter>,
    );

    expect(screen.getByText("Mock Level 1")).toBeInTheDocument();
  });

  test("renders level 2 when level param is 2", () => {
    vi.mocked(ReactRouterDOM.useParams).mockReturnValue({ level: "2" } as any);
    render(
      <MemoryRouter initialEntries={["/quiz/level/2"]}>
        <QuizFlow />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Mock Level 2 - previous IDs/)).toBeInTheDocument();
  });
});
