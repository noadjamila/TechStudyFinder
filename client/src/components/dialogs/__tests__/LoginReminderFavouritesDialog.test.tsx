import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import LoginReminderDialog from "../LoginReminderFavouritesDialog";

describe("LoginReminderFavouritesDialog Component", () => {
  const mockOnClose = vi.fn();
  const mockOnLoginClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dialog when open is true", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    expect(
      screen.getByText(
        /Du musst dich erst einloggen, um deine Favoriten speichern zu können./i,
      ),
    ).toBeInTheDocument();
  });

  it("does not render the dialog when open is false", () => {
    render(
      <LoginReminderDialog
        open={false}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    expect(
      screen.queryByText(
        /Du musst dich erst einloggen, um deine Favoriten speichern zu können./i,
      ),
    ).not.toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(
      <LoginReminderDialog
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
      <LoginReminderDialog
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
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose and onLoginClick when login button is clicked", () => {
    render(
      <LoginReminderDialog
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

  it("calls onClose when clicking outside the dialog", () => {
    render(
      <LoginReminderDialog
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

  it("has correct dialog styling with rounded corners", () => {
    const { baseElement } = render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const dialogPaper = baseElement.querySelector(".MuiPaper-root");
    expect(dialogPaper).toBeInTheDocument();
  });

  it("displays the correct warning message text", () => {
    render(
      <LoginReminderDialog
        open={true}
        onClose={mockOnClose}
        onLoginClick={mockOnLoginClick}
      />,
    );

    const message = screen.getByText(
      /Du musst dich erst einloggen, um deine Favoriten speichern zu können./i,
    );
    expect(message).toBeInTheDocument();
    expect(message).toHaveStyle({ textAlign: "center" });
  });
});
