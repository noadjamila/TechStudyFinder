import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import QuizCard_L2 from "../QuizCard_L2";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("QuizCard_L2", () => {
  test("shows the submitted question", () => {
    const questionText = "Magst du forschen?";

    renderWithTheme(<QuizCard_L2 question={questionText} onSelect={vi.fn()} />);

    expect(screen.getByText(questionText)).toBeInTheDocument();
  });

  test("renders all three answer buttons", () => {
    renderWithTheme(
      <QuizCard_L2 question="Dummy Question" onSelect={vi.fn()} />,
    );

    expect(screen.getByText("Ja")).toBeInTheDocument();
    expect(screen.getByText("Nein")).toBeInTheDocument();
    expect(screen.getByText("Überspringen")).toBeInTheDocument();
  });

  test("calls onSelect correctly when clicking 'Ja'", () => {
    const onSelect = vi.fn();

    renderWithTheme(<QuizCard_L2 question="Q" onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Ja"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("yes");
  });

  test("calls onSelect correctly when clicking 'Nein'", () => {
    const onSelect = vi.fn();

    renderWithTheme(<QuizCard_L2 question="Q" onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Nein"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("no");
  });

  test("calls onSelect correctly when clicking 'Überspringen'", () => {
    const onSelect = vi.fn();

    renderWithTheme(<QuizCard_L2 question="Q" onSelect={onSelect} />);

    fireEvent.click(screen.getByText("Überspringen"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("skip");
  });
});
