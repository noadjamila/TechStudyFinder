import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme/theme";
import { describe, test, beforeEach, expect, vi } from "vitest";
import QuizPage_L2 from "../Quiz/QuizPage_L2";

vi.useRealTimers();

const sampleQuestions = [
  { text: "Magst du forschen?", riasec_type: "R" },
  { text: "Arbeitest du gern kreativ?", riasec_type: "A" },
  { text: "Hilfst du Menschen gern?", riasec_type: "S" },
];

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </MemoryRouter>,
  );

describe("QuizPage_L2", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    (globalThis as any).fetch = fetchMock;
  });

  test("should load questions from backend", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: sampleQuestions }),
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[1, 2]} onNextLevel={() => {}} />,
    );

    expect(fetchMock).toHaveBeenCalledWith("/api/quiz/level/2");

    expect(await screen.findByText("Magst du forschen?")).toBeInTheDocument();
  });

  test("increments score when answering 'yes'", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: sampleQuestions }),
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[]} onNextLevel={() => {}} />,
    );

    await screen.findByText("Magst du forschen?");

    fireEvent.click(screen.getByText("Ja"));

    await waitFor(() => {
      expect(
        screen.getByText("Arbeitest du gern kreativ?"),
      ).toBeInTheDocument();
    });
  });

  test("decrements score when answering 'no'", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: sampleQuestions }),
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[]} onNextLevel={() => {}} />,
    );

    await screen.findByText("Magst du forschen?");

    fireEvent.click(screen.getByText("Nein"));

    await waitFor(() => {
      expect(
        screen.getByText("Arbeitest du gern kreativ?"),
      ).toBeInTheDocument();
    });
  });

  test("skip does not change score (but moves to next question)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: sampleQuestions }),
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[]} onNextLevel={() => {}} />,
    );

    await screen.findByText("Magst du forschen?");

    fireEvent.click(screen.getByText("Überspringen"));

    await waitFor(() => {
      expect(
        screen.getByText("Arbeitest du gern kreativ?"),
      ).toBeInTheDocument();
    });
  });

  test("should show error screen when question loading fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[]} onNextLevel={() => {}} />,
    );

    expect(
      await screen.findByText("Fehler beim Laden der Fragen"),
    ).toBeInTheDocument();
  });

  test("should send correct payload with top three scores", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: sampleQuestions }),
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ids: [10, 11, 12] }),
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[]} onNextLevel={() => {}} />,
    );

    await screen.findByText("Magst du forschen?");

    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() =>
      expect(
        screen.getByText("Arbeitest du gern kreativ?"),
      ).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() =>
      expect(screen.getByText("Hilfst du Menschen gern?")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText("Ja"));

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [, sendCall] = fetchMock.mock.calls;

    expect(sendCall[0]).toBe("http://localhost:5001/api/quiz/filter");

    const options = sendCall[1] as RequestInit;
    const body = JSON.parse(options.body as string);

    expect(body.level).toBe(2);
    expect(body.studyProgrammeIds).toEqual([]);
    expect(body.answers).toHaveLength(3);
  });

  test("should show error screen when sending L2 results fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: sampleQuestions }),
    });

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[]} onNextLevel={() => {}} />,
    );

    await screen.findByText("Magst du forschen?");

    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() =>
      expect(
        screen.getByText("Arbeitest du gern kreativ?"),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() =>
      expect(screen.getByText("Hilfst du Menschen gern?")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Ja"));

    expect(await screen.findByText("Fehler beim Senden")).toBeInTheDocument();
  });

  test("should show debug screen when all questions completed", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ questions: sampleQuestions }),
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ids: [] }),
    });

    renderWithProviders(
      <QuizPage_L2 previousIds={[]} onNextLevel={() => {}} />,
    );

    await screen.findByText("Magst du forschen?");

    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() =>
      expect(
        screen.getByText("Arbeitest du gern kreativ?"),
      ).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Ja"));
    await waitFor(() =>
      expect(screen.getByText("Hilfst du Menschen gern?")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Ja"));

    expect(await screen.findByText("Debug-Screen")).toBeInTheDocument();
  });
});
