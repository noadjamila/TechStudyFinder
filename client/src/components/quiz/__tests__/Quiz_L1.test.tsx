import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";
import { describe, expect, test, vi } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import Quiz_L1 from "../Quiz_L1";
import { postFilterLevel } from "../../../api/quizApi";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

vi.mock("../../../api/quizApi", () => ({
  postFilterLevel: vi.fn(),
}));

vi.spyOn(window, "alert").mockImplementation(() => {});

describe("Quiz_L1", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  test("renders question and options", () => {
    renderWithTheme(<Quiz_L1 onNextLevel={vi.fn()} />);

    expect(screen.getByText("Möchtest du ...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ein Studium beginnen/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Einen Master studieren/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Dich erstmal umschauen/i }),
    ).toBeInTheDocument();
  });

  test("calls API and onNextLevel after selecting an option", async () => {
    const mockNext = vi.fn();
    (postFilterLevel as Mock).mockResolvedValue({ ids: [1, 2, 3] });

    renderWithTheme(<Quiz_L1 onNextLevel={mockNext} />);

    fireEvent.click(screen.getByText(/ein Studium beginnen\?/i));

    await waitFor(() => {
      expect(postFilterLevel).toHaveBeenCalled(); // statt CalledTimes(1)
    });

    expect(mockNext).toHaveBeenCalledWith([1, 2, 3]);
  });

  test("sends empty answers array when 'all' is selected", async () => {
    const mockNext = vi.fn();
    (postFilterLevel as Mock).mockResolvedValue({ ids: [42] });

    renderWithTheme(<Quiz_L1 onNextLevel={mockNext} />);

    fireEvent.click(screen.getByText(/dich erstmal umschauen\?/i));

    await waitFor(() => {
      expect(postFilterLevel).toHaveBeenCalled();
    });

    const payload = (postFilterLevel as Mock).mock.calls[0][0];
    expect(Array.isArray(payload.answers)).toBe(true);
    expect(payload.answers.length).toBe(0);
  });

  test("shows alert on API error", async () => {
    (postFilterLevel as Mock).mockRejectedValue(new Error("fail"));

    renderWithTheme(<Quiz_L1 onNextLevel={vi.fn()} />);

    fireEvent.click(screen.getByText(/ein Studium beginnen\?/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled();
    });
  });
});
