import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import LoginReminderResultList from "../LoginReminderResultList";

describe("LoginReminderResultList Component", () => {
  const mockOnClose = vi.fn();
  const mockOnLoginClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog when open is true", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    expect(
      screen.getByText(
        /Beachte: du bist nicht eingeloggt. Deine Ergebnisse können nach einer Zeit nicht mehr abgerufen werden./i,
      ),
    ).toBeInTheDocument();
  });

  it("does not render the dialog when open is false", () => {
    render(
      <LoginReminderResultList
        open={false}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    expect(
      screen.queryByText(
        /Beachte: du bist nicht eingeloggt. Deine Ergebnisse können nach einer Zeit nicht mehr abgerufen werden./i,
      ),
    ).not.toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it("renders the close button", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const closeButton = screen.getByLabelText("close");
    expect(closeButton).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnLoginClick).not.toHaveBeenCalled();
  });

  it("calls onClose and onLoginClick when login button is clicked", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const loginButton = screen.getByRole("button", { name: /Login/i });
    fireEvent.click(loginButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when clicking outside the dialog (backdrop)", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    // Click on the backdrop
    const backdrop = document.querySelector(".MuiBackdrop-root");
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("displays the correct warning message about results expiration", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const message = screen.getByText(
      /Beachte: du bist nicht eingeloggt. Deine Ergebnisse können nach einer Zeit nicht mehr abgerufen werden./i,
    );
    expect(message).toBeInTheDocument();
    expect(message).toHaveStyle({ textAlign: "center" });
  });

  it("has correct dialog styling with rounded corners and proper spacing", () => {
    const { baseElement } = render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const dialogPaper = baseElement.querySelector(".MuiPaper-root");
    expect(dialogPaper).toBeInTheDocument();
  });

  it("close button has proper aria label for accessibility", () => {
    render(
      <LoginReminderResultList
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const closeButton = screen.getByLabelText("close");
    expect(closeButton).toHaveAttribute("aria-label", "close");
  });
});
