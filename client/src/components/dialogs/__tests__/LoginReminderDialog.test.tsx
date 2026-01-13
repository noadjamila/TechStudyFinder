import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import LoginReminderDialog from "../LoginReminderDialog";

describe("LoginReminderDialog Component", () => {
  const mockOnClose = vi.fn();
  const mockOnLoginClick = vi.fn();
  const testMessage =
    "Du musst dich erst einloggen, um deine Favoriten speichern zu können.";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog when open is true", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it("does not render the dialog when open is false", () => {
    render(
      <LoginReminderDialog
        open={false}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    expect(screen.queryByText(testMessage)).not.toBeInTheDocument();
  });

  it("renders the custom message prop correctly", () => {
    const customMessage =
      "Beachte: du bist nicht eingeloggt. Deine Ergebnisse können nach einer Zeit nicht mehr abgerufen werden.";
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={customMessage}
      />,
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("renders the close button", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    const closeButton = screen.getByLabelText("close");
    expect(closeButton).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnLoginClick).not.toHaveBeenCalled();
  });

  it("calls onClose and onLoginClick when login button is clicked", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking outside the dialog (backdrop)", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    // Click on the backdrop
    const backdrop = document.querySelector(".MuiBackdrop-root");
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("displays the message with correct styling", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    const message = screen.getByText(testMessage);
    expect(message).toBeInTheDocument();
    expect(message).toHaveStyle({ textAlign: "center" });
  });

  it("has correct dialog styling with rounded corners and proper spacing", () => {
    const { baseElement } = render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    const dialogPaper = baseElement.querySelector(".MuiPaper-root");
    expect(dialogPaper).toBeInTheDocument();
  });

  it("close button has proper aria label for accessibility", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
        message={testMessage}
      />,
    );

    const closeButton = screen.getByLabelText("close");
    expect(closeButton).toHaveAttribute("aria-label", "close");
  });
});
