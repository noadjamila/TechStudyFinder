import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import QuizFlow from "../QuizFlow";
import * as quizApi from "../../api/quizApi";

const navigateMock = vi.fn();

vi.spyOn(quizApi, "postFilterLevel").mockResolvedValue({
  ids: [],
});

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../components/quiz/LevelSuccessScreen", () => ({
  __esModule: true,
  default: ({
    currentLevel,
    onContinue,
  }: {
    currentLevel: number;
    onContinue: () => void;
  }) => (
    <div>
      <div>Mock Success Level {currentLevel}</div>
      <button onClick={onContinue}>continue</button>
    </div>
  ),
}));

vi.mock("../../components/quiz/Quiz_L1", () => ({
  __esModule: true,
  default: ({
    onAnswer,
    onComplete,
  }: {
    onAnswer: (answer: any) => void;
    onComplete: () => void;
  }) => (
    <div>
      <div>Mock Level 1</div>
      <button
        onClick={() => {
          onAnswer({ questionId: "l1", value: "yes", answeredAt: 1 });
          onComplete();
        }}
      >
        go-to-l2
      </button>
    </div>
  ),
}));

vi.mock("../../components/quiz/Quiz_L2", () => ({
  __esModule: true,
  default: ({
    onAnswer,
    onComplete,
    oneLevelBack,
  }: {
    onAnswer: (answer: any) => void;
    onComplete: () => void;
    oneLevelBack: () => void;
  }) => (
    <div>
      <div>Mock Level 2</div>
      <button
        onClick={() => {
          onAnswer({ questionId: "l2", value: "yes", answeredAt: 2 });
          onComplete();
        }}
      >
        go-to-l3
      </button>
      <button onClick={oneLevelBack}>back</button>
    </div>
  ),
}));

describe("QuizFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Successcreen first", () => {
    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    expect(screen.getByText("Mock Success Level 1")).toBeInTheDocument();
  });

  test("renders level 1 after continue", () => {
    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("continue"));

    expect(screen.getByText("Mock Level 1")).toBeInTheDocument();
  });

  test("switches from level 1 to level 2 and shows SuccessScreen", () => {
    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("continue")); // L1 start
    fireEvent.click(screen.getByText("go-to-l2")); // finish L1

    expect(screen.getByText("Mock Success Level 2")).toBeInTheDocument();
  });

  test("navigates to /result after level 2", () => {
    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("continue")); // L1
    fireEvent.click(screen.getByText("go-to-l2")); // finish L1
    fireEvent.click(screen.getByText("continue")); // show L2 success screen
    fireEvent.click(screen.getByText("go-to-l3")); // finish L2
    fireEvent.click(screen.getByText("continue"));

    expect(navigateMock).toHaveBeenCalledWith("/results", {
      state: {
        answers: {
          l1: { questionId: "l1", value: "yes", answeredAt: 1 },
          l2: { questionId: "l2", value: "yes", answeredAt: 2 },
        },
      },
    });
  });
});
