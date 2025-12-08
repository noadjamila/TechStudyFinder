import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import QuizCard_L1 from "../QuizCard_L1";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("QuizCard_L1", () => {
  test("renders question and fixed Level-1 buttons", () => {
    renderWithTheme(
      <QuizCard_L1 question="Möchtest du ..." onSelect={vi.fn()} />,
    );

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

  test("calls onSelect with correct value when clicking an option", () => {
    const onSelect = vi.fn();

    renderWithTheme(
      <QuizCard_L1 question="Möchtest du ..." onSelect={onSelect} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Ein Studium beginnen/i }),
    );

    expect(onSelect).toHaveBeenCalledWith("grundständig");

    fireEvent.click(
      screen.getByRole("button", { name: /Einen Master studieren/i }),
    );

    expect(onSelect).toHaveBeenCalledWith("weiterführend");

    fireEvent.click(
      screen.getByRole("button", { name: /Dich erstmal umschauen/i }),
    );

    expect(onSelect).toHaveBeenCalledWith("all");
  });
});
