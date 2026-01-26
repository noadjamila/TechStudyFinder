import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import QuizFlow from "../QuizFlow";
import * as persist from "../../session/persistQuizSession";
import { waitFor } from "@testing-library/react";

const navigateMock = vi.fn();

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
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, username: "testuser" },
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
  }),
}));

vi.mock("../../api/quizApi", async () => {
  const actual =
    await vi.importActual<typeof import("../../api/quizApi")>(
      "../../api/quizApi",
    );

  return {
    ...actual,
    postFilterLevel: vi.fn().mockResolvedValue({ ids: [] }),
    fetchQuestions: vi.fn().mockResolvedValue([]),
    saveQuizResults: vi.fn().mockResolvedValue(undefined),
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
    level1ids,
  }: {
    onAnswer: (answer: any) => void;
    level1ids: (ids: string[]) => void;
  }) => (
    <div>
      <div>Mock Level 1</div>
      <button
        onClick={() => {
          onAnswer({ questionId: "l1", value: "yes", answeredAt: 1 });
          level1ids(["id-1", "id-2"]);
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
    onComplete: () => Promise<void> | void;
    oneLevelBack: () => void;
  }) => (
    <div>
      <div>Mock Level 2</div>
      <button
        onClick={async () => {
          onAnswer({ questionId: "l2", value: "yes", answeredAt: 2 });
          await onComplete();
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

  test("switches from level 1 to level 2 and shows SuccessScreen", async () => {
    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("continue")); // L1 start
    fireEvent.click(screen.getByText("go-to-l2")); // finish L1

    expect(await screen.findByText("Mock Success Level 2")).toBeInTheDocument();
  });
  test("handleAnswer stores answer in session", async () => {
    const saveSpy = vi.spyOn(persist, "saveSession");

    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("continue")); // L1
    fireEvent.click(screen.getByText("go-to-l2")); // answer L1

    await waitFor(() => {
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          answers: {
            l1: expect.objectContaining({
              value: "yes",
            }),
          },
        }),
      );
    });
  });

  test("navigates to /result after level 2", async () => {
    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("continue")); // L1
    fireEvent.click(screen.getByText("go-to-l2"));
    await screen.findByText("Mock Success Level 2"); // finish L1
    fireEvent.click(screen.getByText("continue")); // show L2 success screen
    fireEvent.click(screen.getByText("go-to-l3"));
    await screen.findByText("Mock Success Level 3"); // finish L2
    fireEvent.click(screen.getByText("continue"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/results", {
        state: { resultIds: [] },
      });
    });
  });
});
