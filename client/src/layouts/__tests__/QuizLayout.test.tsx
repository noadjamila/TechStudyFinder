import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme/theme";
import QuizLayout, { QuizLayoutProps } from "../QuizLayout";

const DummyChild = () => <div>Test Content</div>;

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("QuizLayout", () => {
  const defaultProps: QuizLayoutProps = {
    currentIndex: 2,
    questionsTotal: 10,
    children: <DummyChild />,
  };

  test("renders the progressbar with correct props", () => {
    renderWithTheme(<QuizLayout {...defaultProps} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();

    expect(
      screen.getByText(
        `Frage ${defaultProps.currentIndex} von ${defaultProps.questionsTotal}`,
      ),
    ).toBeInTheDocument();
  });

  test("renders children correctly", () => {
    renderWithTheme(<QuizLayout {...defaultProps} />);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
