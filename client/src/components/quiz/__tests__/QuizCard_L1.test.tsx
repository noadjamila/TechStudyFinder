import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import QuizCard_L1, { QuizCardBaseProps, QuizOption } from "../QuizCard_L1";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("QuizCard_L1", () => {
  const baseOptions: QuizOption<string>[] = [
    { label: "Option A", value: "a" },
    { label: "Option B", value: "b" },
    { label: "Option C", value: "c" },
  ];

  const defaultProps: QuizCardBaseProps<string> = {
    question: "Möchtest du...",
    options: baseOptions,
    selected: undefined,
    onSelect: vi.fn(),
  };

  test("renders question and options", () => {
    renderWithTheme(<QuizCard_L1 {...(defaultProps as any)} />);

    expect(screen.getByText("Möchtest du...")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  test("marks the selected option as checked", () => {
    renderWithTheme(<QuizCard_L1 {...(defaultProps as any)} selected="b" />);

    const radioA = screen.getByRole("radio", { name: "Option A" });
    const radioB = screen.getByRole("radio", { name: "Option B" });
    const radioC = screen.getByRole("radio", { name: "Option C" });

    expect(radioA).not.toBeChecked();
    expect(radioB).toBeChecked();
    expect(radioC).not.toBeChecked();
  });

  test("calls onSelect with correct value when clicking an option", () => {
    const onSelect = vi.fn();

    renderWithTheme(
      <QuizCard_L1 {...(defaultProps as any)} onSelect={onSelect} />,
    );

    fireEvent.click(screen.getByText("Option C"));

    expect(onSelect).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith("c");
  });

  test("does not render radio buttons or options when showRadioButtons is false", () => {
    const onSelect = vi.fn();

    renderWithTheme(
      <QuizCard_L1
        {...(defaultProps as any)}
        showRadioButtons={false}
        onSelect={onSelect}
      />,
    );

    expect(screen.queryByRole("radio")).toBeNull();
    expect(screen.queryByText("Option A")).toBeNull();
    expect(screen.queryByText("Option B")).toBeNull();
    expect(screen.queryByText("Option C")).toBeNull();
  });

  test("renders mascot image when imageSrc is provided", () => {
    renderWithTheme(
      <QuizCard_L1 {...(defaultProps as any)} imageSrc="/path/to/mascot.png" />,
    );

    const img = screen.getByAltText("Quiz Mascot");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/path/to/mascot_walking_pink.png");
  });

  test("renders children content below options", () => {
    renderWithTheme(
      <QuizCard_L1 {...(defaultProps as any)}>
        <div>Zusätzlicher Inhalt</div>
      </QuizCard_L1>,
    );

    expect(screen.getByText("Zusätzlicher Inhalt")).toBeInTheDocument();
  });
});
