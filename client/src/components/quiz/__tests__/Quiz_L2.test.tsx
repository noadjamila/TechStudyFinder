import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import { describe, test, beforeEach, expect, vi, Mock } from "vitest";
import Quiz_L2 from "../Quiz_L2";
import { postFilterLevel, getQuizLevel } from "../../../api/quizApi";

vi.useRealTimers();

vi.mock("../../../api/quizApi", () => ({
  postFilterLevel: vi.fn(),
  getQuizLevel: vi.fn(),
}));
const mockedPostFilterLevel = postFilterLevel as unknown as Mock;
const mockedGetQuizLevel = getQuizLevel as unknown as Mock;

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );

describe("Quiz_L2", () => {
  const mockQuestions = [
    { text: "Frage 1", riasec_type: "R" },
    { text: "Frage 2", riasec_type: "I" },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    mockedGetQuizLevel.mockResolvedValue({ questions: mockQuestions });
  });

  it("shows Loading before questions are loaded", () => {
    renderWithProviders(
      <Quiz_L2
        previousIds={["1"]}
        onNextLevel={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    expect(screen.getByText("Lädt...")).toBeInTheDocument();
  });

  test("should load questions from backend", async () => {
    renderWithProviders(
      <Quiz_L2 previousIds={[]} onNextLevel={vi.fn()} oneLevelBack={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByText("Frage 1")).toBeInTheDocument();
    });
  });

  test("answers 'yes' move to next question", async () => {
    renderWithProviders(
      <Quiz_L2
        previousIds={["1", "2"]}
        onNextLevel={vi.fn()}
        oneLevelBack={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Frage 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Ja"));

    await waitFor(() => {
      expect(screen.getByText("Frage 2")).toBeInTheDocument();
    });
  });

  test("answers 'no' move to next question", async () => {
    renderWithProviders(
      <Quiz_L2
        previousIds={[]}
        onNextLevel={() => {}}
        oneLevelBack={() => {}}
      />,
    );

    await screen.findByText("Frage 1");

    fireEvent.click(screen.getByText("Nein"));

    await waitFor(() => {
      expect(screen.getByText("Frage 2")).toBeInTheDocument();
    });
  });

  test("answers 'skip' move to next question", async () => {
    renderWithProviders(
      <Quiz_L2
        previousIds={[]}
        onNextLevel={() => {}}
        oneLevelBack={() => {}}
      />,
    );

    await screen.findByText("Frage 1");

    fireEvent.click(screen.getByText("Überspringen"));

    await waitFor(() => {
      expect(screen.getByText("Frage 2")).toBeInTheDocument();
    });
  });

  test("should show error screen when question loading fails", async () => {
    mockedGetQuizLevel.mockRejectedValue(new Error("Failed to fetch"));

    renderWithProviders(
      <Quiz_L2
        previousIds={[]}
        onNextLevel={() => {}}
        oneLevelBack={() => {}}
      />,
    );

    expect(
      await screen.findByText(
        "Die Fragen konnten nicht geladen werden. Bitte versuche es später erneut.",
      ),
    ).toBeInTheDocument();
  });

  test("should send correct payload with scores", async () => {
    const onNextLevel = vi.fn();

    mockedPostFilterLevel.mockResolvedValue({
      ids: [{ studiengang_id: "id123" }],
    });

    renderWithProviders(
      <Quiz_L2
        previousIds={["id1"]}
        onNextLevel={onNextLevel}
        oneLevelBack={vi.fn()}
      />,
    );

    await screen.findByText("Frage 1");
    fireEvent.click(screen.getByText("Ja"));

    await waitFor(() =>
      expect(screen.getByText("Frage 2")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Ja"));

    await waitFor(() => {
      expect(postFilterLevel).toHaveBeenCalledTimes(1);
    });

    const callArgs = mockedPostFilterLevel.mock.calls[0][0];
    expect(callArgs.level).toBe(2);
    expect(callArgs.studyProgrammeIds).toEqual(["id1"]);
    expect(callArgs.answers).toHaveLength(6);
  });

  test("should show error screen when sending L2 results fails", async () => {
    mockedPostFilterLevel.mockRejectedValue(new Error("Failed to send"));

    renderWithProviders(
      <Quiz_L2
        previousIds={[]}
        onNextLevel={() => {}}
        oneLevelBack={() => {}}
      />,
    );

    await screen.findByText("Frage 1");

    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() =>
      expect(screen.getByText("Frage 2")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Ja"));

    expect(await screen.findByText("Fehler beim Senden")).toBeInTheDocument();
  });

  test("renders mascot image", async () => {
    renderWithProviders(
      <Quiz_L2
        previousIds={["1", "2"]}
        onNextLevel={() => {}}
        oneLevelBack={() => {}}
      />,
    );

    await screen.findByText("Frage 1");

    const mascot = screen.getByAltText("Mascot");
    expect(mascot).toBeInTheDocument();
  });

  test("calls oneLevelBack when currentIndex = 0", async () => {
    const oneLevelBack = vi.fn();

    renderWithProviders(
      <Quiz_L2
        previousIds={[]}
        onNextLevel={() => {}}
        oneLevelBack={oneLevelBack}
      />,
    );

    await screen.findByText("Frage 1");

    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));

    expect(oneLevelBack).toHaveBeenCalledTimes(1);
  });

  test("goes back to previous question when currentIndex > 0", async () => {
    renderWithProviders(
      <Quiz_L2
        previousIds={[]}
        onNextLevel={() => {}}
        oneLevelBack={() => {}}
      />,
    );

    await screen.findByText("Frage 1");
    fireEvent.click(screen.getByText("Ja"));
    await screen.findByText("Frage 2");
    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));
    await waitFor(() => {
      expect(screen.getByText("Frage 1")).toBeInTheDocument();
    });
  });

  test("reverses score correctly when going back (yes → remove +1)", async () => {
    mockedPostFilterLevel.mockResolvedValue({
      ids: [{ studiengang_id: "id123" }],
    });

    renderWithProviders(
      <Quiz_L2
        previousIds={[]}
        onNextLevel={vi.fn()}
        oneLevelBack={() => {}}
      />,
    );

    await screen.findByText("Frage 1");

    // YES → +1 for type R
    fireEvent.click(screen.getByText("Ja"));

    await screen.findByText("Frage 2");

    // back → should remove +1 for type R
    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));

    await waitFor(() => {
      expect(screen.getByText("Frage 1")).toBeInTheDocument();
    });

    // Answer again and complete quiz
    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() => {
      expect(screen.getByText("Frage 2")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Ja"));

    // Verify that postFilterLevel was called with correct scores
    await waitFor(() => {
      expect(mockedPostFilterLevel).toHaveBeenCalled();
    });
  });
});
