import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import QuizFlow from "../QuizFlow";

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

vi.mock("../../api/quizApi", () => ({
  saveQuizResults: vi.fn().mockResolvedValue(undefined),
}));

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
  default: ({ onNextLevel }: { onNextLevel: (ids: string[]) => void }) => (
    <div>
      <div>Mock Level 1</div>
      <button onClick={() => onNextLevel(["1", "2"])}>go-to-l2</button>
    </div>
  ),
}));

vi.mock("../../components/quiz/Quiz_L2", () => ({
  __esModule: true,
  default: ({
    previousIds,
    onNextLevel,
  }: {
    previousIds: string[];
    onNextLevel: (ids: string[]) => void;
  }) => (
    <div>
      <div>Mock Level 2 - previous IDs: {previousIds.join(",")}</div>
      <button onClick={() => onNextLevel(["3"])}>go-to-l3</button>
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

  test("navigates to /result after level 2", async () => {
    render(
      <MemoryRouter>
        <QuizFlow />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("continue")); // L1
    fireEvent.click(screen.getByText("go-to-l2")); // finish L1
    fireEvent.click(screen.getByText("continue")); // L2
    fireEvent.click(screen.getByText("go-to-l3")); // finish L2

    // Wait for the success screen to appear after async operation
    await screen.findByText("Mock Success Level 3");
    fireEvent.click(screen.getByText("continue"));

    expect(navigateMock).toHaveBeenCalledWith("/results", {
      state: { idsFromLevel2: ["3"] },
    });
  });
});
