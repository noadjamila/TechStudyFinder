import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginResultDialog from "../LoginResultDialog";

describe("LoginResultDialog", () => {
  it("displays success message when success is true", () => {
    render(
      <LoginResultDialog
        open={true}
        success={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    expect(screen.getByText("Login erfolgreich")).toBeInTheDocument();
  });

  it("displays error message when success is false", () => {
    render(
      <LoginResultDialog
        open={true}
        success={false}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    expect(
      screen.getByText(
        "Username oder Passwort falsch - Bitte versuche es erneut",
      ),
    ).toBeInTheDocument();
  });

  it("renders with success severity when success is true", () => {
    const { container } = render(
      <LoginResultDialog
        open={true}
        success={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    const alert = container.querySelector(".MuiAlert-root");
    expect(alert).toHaveClass("MuiAlert-standardSuccess");
  });

  it("renders with error severity when success is false", () => {
    const { container } = render(
      <LoginResultDialog
        open={true}
        success={false}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    const alert = container.querySelector(".MuiAlert-root");
    expect(alert).toHaveClass("MuiAlert-standardError");
  });

  it("does not render when open is false", () => {
    const { container } = render(
      <LoginResultDialog
        open={false}
        success={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    const alert = container.querySelector(".MuiAlert-root");
    expect(alert).not.toBeInTheDocument();
  });

  it("calls onClose when snackbar closes", async () => {
    const onClose = vi.fn();
    render(
      <LoginResultDialog
        open={true}
        success={true}
        onClose={onClose}
        autoCloseDuration={100}
      />,
    );

    await waitFor(
      () => {
        expect(onClose).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  it("uses default autoCloseDuration when not provided", () => {
    const { container } = render(
      <LoginResultDialog open={true} success={true} onClose={vi.fn()} />,
    );

    const snackbar = container.querySelector(".MuiSnackbar-root");
    // Default is 800ms, check that snackbar exists (will auto-close after)
    expect(snackbar).toBeInTheDocument();
  });

  it("updates when open prop changes", () => {
    const { rerender } = render(
      <LoginResultDialog
        open={false}
        success={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    expect(() => screen.getByText("Login erfolgreich")).toThrow();

    rerender(
      <LoginResultDialog
        open={true}
        success={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    expect(screen.getByText("Login erfolgreich")).toBeInTheDocument();
  });

  it("positions snackbar at top center", () => {
    const { container } = render(
      <LoginResultDialog
        open={true}
        success={true}
        onClose={vi.fn()}
        autoCloseDuration={5000}
      />,
    );

    const snackbar = container.querySelector(
      ".MuiSnackbar-anchorOriginTopCenter",
    );
    expect(snackbar).toBeInTheDocument();
  });
});
