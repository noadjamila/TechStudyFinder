import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
  test("renders the Back Button when showBackButton = true", () => {
    renderWithTheme(<QuizLayout {...defaultProps} showBackButton={true} />);

    const backButton = screen.getByRole("button", { name: "Zurück" });
    expect(backButton).toBeInTheDocument();
  });

  test("does not render the Back Button when showBackButton = false", () => {
    renderWithTheme(<QuizLayout {...defaultProps} showBackButton={false} />);

    const backButton = screen.queryByRole("button", { name: "Zurück" });
    expect(backButton).not.toBeInTheDocument();
  });

  test("calls oneBack when the Back Button is clicked", () => {
    const mockOneBack = vi.fn();

    renderWithTheme(
      <QuizLayout
        {...defaultProps}
        oneBack={mockOneBack}
        showBackButton={true}
      />,
    );

    const backButton = screen.getByRole("button", { name: "Zurück" });

    fireEvent.click(backButton);

    expect(mockOneBack).toHaveBeenCalledTimes(1);
  });

  test("Back Button has correct label", () => {
    renderWithTheme(<QuizLayout {...defaultProps} showBackButton={true} />);

    expect(screen.getByRole("button", { name: "Zurück" })).toBeInTheDocument();
  });
});
