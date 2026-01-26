import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import EmptyStateCard from "../EmptyStateCard";
import theme from "../../../theme/theme";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("EmptyStateCard Component", () => {
  it("renders the message text", () => {
    const mockOnClick = vi.fn();
    renderWithTheme(
      <EmptyStateCard
        message="Test message"
        buttonLabel="Test Button"
        onButtonClick={mockOnClick}
      />,
    );

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders message with JSX content", () => {
    const mockOnClick = vi.fn();
    renderWithTheme(
      <EmptyStateCard
        message={
          <>
            First line
            <br />
            Second line
          </>
        }
        buttonLabel="Test Button"
        onButtonClick={mockOnClick}
      />,
    );

    expect(screen.getByText(/First line/i)).toBeInTheDocument();
    expect(screen.getByText(/Second line/i)).toBeInTheDocument();
  });

  it("renders the button with correct label", () => {
    const mockOnClick = vi.fn();
    renderWithTheme(
      <EmptyStateCard
        message="Test message"
        buttonLabel="Click Me"
        onButtonClick={mockOnClick}
      />,
    );

    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders the mascot image", () => {
    const mockOnClick = vi.fn();
    const { container } = renderWithTheme(
      <EmptyStateCard
        message="Test message"
        buttonLabel="Test Button"
        onButtonClick={mockOnClick}
      />,
    );

    const mascotImage = container.querySelector('img[alt="Maskottchen"]');
    expect(mascotImage).toBeInTheDocument();
    expect(mascotImage).toHaveAttribute("src", "/mascot_standing_blue.svg");
  });

  it("calls onButtonClick when button is clicked", () => {
    const mockOnClick = vi.fn();
    renderWithTheme(
      <EmptyStateCard
        message="Test message"
        buttonLabel="Test Button"
        onButtonClick={mockOnClick}
      />,
    );

    const button = screen.getByText("Test Button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with CardStack wrapper", () => {
    const mockOnClick = vi.fn();
    const { container } = renderWithTheme(
      <EmptyStateCard
        message="Test message"
        buttonLabel="Test Button"
        onButtonClick={mockOnClick}
      />,
    );

    // Check that the card content exists
    const messageText = screen.getByText("Test message");
    expect(messageText).toBeInTheDocument();
    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
  });

  it("applies correct styling to components", () => {
    const mockOnClick = vi.fn();
    renderWithTheme(
      <EmptyStateCard
        message="Test message"
        buttonLabel="Test Button"
        onButtonClick={mockOnClick}
      />,
    );

    const button = screen.getByText("Test Button");
    expect(button).toHaveClass("MuiButton-root");
  });
});
